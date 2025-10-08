const Cart = require("../models/Cart");
const Product = require("../models/Product");
const { v4: uuidv4 } = require("uuid");

const getCartByUserId = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const cartItems = await Cart.findAll({
      where: { user_id: userId },
      include: [
        {
          model: Product,
          attributes: ['product_id', 'name', 'price', 'highlight_img', 'avail_qty']
        }
      ]
    });

    return res.status(200).json({
      message: "success",
      data: cartItems,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const addToCart = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { product_id, cart_qty } = req.body;
    if (!product_id || !cart_qty) {
      return res.status(400).json({ message: "product_id and cart_qty are required" });
    }

    // Check if product exists and has enough stock
    const product = await Product.findOne({
      where: { product_id }
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    if (product.avail_qty < cart_qty) {
      return res.status(400).json({ message: "Insufficient stock" });
    }

    // Check if item already exists in cart
    const existingCartItem = await Cart.findOne({
      where: { user_id: userId, product_id }
    });

    if (existingCartItem) {
      // Update quantity
      const newQty = existingCartItem.cart_qty + cart_qty;
      if (product.avail_qty < newQty) {
        return res.status(400).json({ message: "Insufficient stock for total quantity" });
      }
      await existingCartItem.update({ cart_qty: newQty });
      return res.status(200).json({
        message: "Cart updated successfully",
        data: existingCartItem
      });
    } else {
      // Add new item to cart
      const cartItem = await Cart.create({
        cart_id: uuidv4(),
        user_id: userId,
        product_id,
        cart_qty
      });

      return res.status(201).json({
        message: "Item added to cart successfully",
        data: cartItem
      });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateCartItem = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { cart_id } = req.params;
    const { cart_qty } = req.body;

    if (!cart_qty) {
      return res.status(400).json({ message: "cart_qty is required" });
    }

    const cartItem = await Cart.findOne({
      where: { cart_id, user_id: userId }
    });

    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    // Check product stock
    const product = await Product.findOne({
      where: { product_id: cartItem.product_id }
    });

    if (product.avail_qty < cart_qty) {
      return res.status(400).json({ message: "Insufficient stock" });
    }

    await cartItem.update({ cart_qty });
    return res.status(200).json({
      message: "Cart item updated successfully",
      data: cartItem
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { cart_id } = req.params;

    const cartItem = await Cart.findOne({
      where: { cart_id, user_id: userId }
    });

    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    await cartItem.destroy();
    return res.status(200).json({
      message: "Item removed from cart successfully",
      data: cartItem
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const clearCart = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    await Cart.destroy({
      where: { user_id: userId }
    });

    return res.status(200).json({
      message: "Cart cleared successfully"
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getCartByUserId,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
};
