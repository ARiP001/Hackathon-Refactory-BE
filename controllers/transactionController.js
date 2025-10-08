const History = require("../models/History");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const { v4: uuidv4 } = require("uuid");
const sequelize = require("../config/database");

const createTransaction = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { payment_type } = req.body;
    if (!payment_type || !['Cod', 'cash', 'Digital'].includes(payment_type)) {
      return res.status(400).json({ message: "Valid payment_type is required (Cod, cash, or Digital)" });
    }

    // Get user's cart items
    const cartItems = await Cart.findAll({
      where: { user_id: userId },
      include: [
        {
          model: Product,
          attributes: ['product_id', 'name', 'price', 'avail_qty']
        }
      ]
    });

    if (cartItems.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Validate stock and calculate total
    let totalAmount = 0;
    const transactionItems = [];

    for (const cartItem of cartItems) {
      const product = cartItem.Product;
      
      if (product.avail_qty < cartItem.cart_qty) {
        return res.status(400).json({ 
          message: `Insufficient stock for ${product.name}. Available: ${product.avail_qty}, Requested: ${cartItem.cart_qty}` 
        });
      }

      const itemTotal = product.price * cartItem.cart_qty;
      totalAmount += itemTotal;

      transactionItems.push({
        history_id: uuidv4(),
        uuid: userId,
        product_id: product.product_id,
        quantity: cartItem.cart_qty,
        price: product.price,
        payment_type
      });
    }

    // Create transaction records
    await History.bulkCreate(transactionItems);

    // Update product stock
    for (const cartItem of cartItems) {
      const product = cartItem.Product;
      const newQty = product.avail_qty - cartItem.cart_qty;
      
      await Product.update(
        { 
          avail_qty: newQty,
          status: newQty === 0 ? 'sold' : product.status
        },
        { where: { product_id: product.product_id } }
      );
    }

    // Clear user's cart
    await Cart.destroy({ where: { user_id: userId } });

    return res.status(201).json({
      message: "Transaction completed successfully",
      data: {
        transaction_id: uuidv4(),
        total_amount: totalAmount,
        payment_type,
        items_count: transactionItems.length,
        items: transactionItems
      }
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getTransactionHistory = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const transactions = await History.findAll({
      where: { uuid: userId },
      include: [
        {
          model: Product,
          attributes: ['product_id', 'name', 'highlight_img']
        }
      ],
      order: [['history_id', 'DESC']]
    });

    return res.status(200).json({
      message: "success",
      data: transactions
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getTransactionById = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { transaction_id } = req.params;

    const transaction = await History.findOne({
      where: { history_id: transaction_id, uuid: userId },
      include: [
        {
          model: Product,
          attributes: ['product_id', 'name', 'highlight_img', 'description']
        }
      ]
    });

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    return res.status(200).json({
      message: "success",
      data: transaction
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getTransactionSummary = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Get transaction statistics
    const totalTransactions = await History.count({
      where: { uuid: userId }
    });

    const totalSpent = await History.sum('price', {
      where: { uuid: userId }
    });

    const transactionsByPayment = await History.findAll({
      where: { uuid: userId },
      attributes: [
        'payment_type',
        [sequelize.fn('COUNT', sequelize.col('history_id')), 'count'],
        [sequelize.fn('SUM', sequelize.col('price')), 'total']
      ],
      group: ['payment_type']
    });

    return res.status(200).json({
      message: "success",
      data: {
        total_transactions: totalTransactions,
        total_spent: totalSpent || 0,
        payment_breakdown: transactionsByPayment
      }
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const directPurchase = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { product_id, quantity, payment_type } = req.body;
    
    if (!product_id || !quantity || !payment_type) {
      return res.status(400).json({ message: "product_id, quantity, and payment_type are required" });
    }

    if (!['Cod', 'cash', 'Digital'].includes(payment_type)) {
      return res.status(400).json({ message: "Valid payment_type is required (Cod, cash, or Digital)" });
    }

    // Find product
    const product = await Product.findOne({
      where: { product_id }
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check stock
    if (product.avail_qty < quantity) {
      return res.status(400).json({ 
        message: `Insufficient stock. Available: ${product.avail_qty}, Requested: ${quantity}` 
      });
    }

    // Create transaction record
    const transaction = await History.create({
      history_id: uuidv4(),
      uuid: userId,
      product_id,
      quantity,
      price: product.price,
      payment_type
    });

    // Update product stock
    const newQty = product.avail_qty - quantity;
    await Product.update(
      { 
        avail_qty: newQty,
        status: newQty === 0 ? 'sold' : product.status
      },
      { where: { product_id } }
    );

    const totalAmount = product.price * quantity;

    return res.status(201).json({
      message: "Direct purchase completed successfully",
      data: {
        transaction_id: transaction.history_id,
        product_name: product.name,
        quantity,
        unit_price: product.price,
        total_amount: totalAmount,
        payment_type
      }
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const cancelTransaction = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { transaction_id } = req.params;

    const transaction = await History.findOne({
      where: { history_id: transaction_id, uuid: userId }
    });

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    // Restore product stock
    const product = await Product.findOne({
      where: { product_id: transaction.product_id }
    });

    if (product) {
      const newQty = product.avail_qty + transaction.quantity;
      await Product.update(
        { 
          avail_qty: newQty,
          status: newQty > 0 ? 'available' : product.status
        },
        { where: { product_id: transaction.product_id } }
      );
    }

    // Delete transaction
    await transaction.destroy();

    return res.status(200).json({
      message: "Transaction cancelled successfully"
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createTransaction,
  getTransactionHistory,
  getTransactionById,
  getTransactionSummary,
  directPurchase,
  cancelTransaction,
};
