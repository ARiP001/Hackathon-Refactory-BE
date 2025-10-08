const Product = require("../models/Product");
const { v4: uuidv4 } = require("uuid");

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    // Return
    return res.status(200).json({
      message: "success",
      data: products,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findOne({
      where: { id: req.params.id },
    });
    // Return
    return res.status(200).json({
      message: "success",
      data: product,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const createProduct = async (req, res) => {
  try {
    // Request
    const {
      name,
      description,
      category_id,
      price,
      condition,
      highlight_img,
      detail_img,
      total_qty,
    } = req.body;

    // Bikin data form
    const uuid = uuidv4();
    const data = {
      uuid,
      name,
      description,
      category_id,
      price,
      condition,
      highlight_img,
      detail_img,
      total_qty,
      avail_qty: total_qty,
    };

    // Validation
    if (
      !name ||
      !description ||
      !category_id ||
      !price ||
      !condition ||
      !highlight_img ||
      !detail_img ||
      !total_qty
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Create
    const product = await Product.create(data);
    // Return
    return res.status(201).json({
      message: "success",
      data: product,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findOne({
      where: { id: req.params.id },
    });
    // Validation
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    // Update
    await product.update(req.body);
    // Return
    return res.status(200).json({
      message: "success",
      data: product,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOne({
      where: { id: req.params.id },
    });
    // Validation
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    // Delete
    await product.delete();
    // Return
    return res.status(200).json({
      message: "success",
      data: product,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateProductStatus = async (req, res) => {
  try {
    const product = await Product.findOne({
      where: { id: req.params.id },
    });
    // Validation
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    // Update
    await product.update(req.body);
    // Return
    return res.status(200).json({
      message: "success",
      data: product,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getProductsByUserId = async (req, res) => {
  try {
    const products = await Product.findAll({
      where: { user_id: req.params.user_id },
    });
    // Return
    return res.status(200).json({
      message: "success",
      data: products,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getProductsBySearch = async (req, res) => {
  try {
    const query = req.query || {};

    // Get
    const products = await Product.findAll({
      where: { name: query },
    });

    // Return
    return res.status(200).json({
      message: "success",
      data: products,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  updateProductStatus,
  getProductsByUserId,
  getProductsBySearch,
};
