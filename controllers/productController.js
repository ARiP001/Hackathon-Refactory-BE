const Product = require("../models/Product");
const Category = require("../models/Category");

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
      where: { product_id: req.params.id },
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
    const userUuid = req.user?.id; // from authenticate middleware
    if (!userUuid) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { name, description, category_id, price, condition, total_qty } =
      req.body || {};

    if (!name || !category_id || !price || !condition || !total_qty) {
      return res.status(400).json({
        message: "name, category_id, price, condition, total_qty are required",
      });
    }

    let highlightUrl =
      typeof req.body.highlight_img === "string"
        ? req.body.highlight_img
        : null;
    let detailUrls = Array.isArray(req.body.detail_img)
      ? req.body.detail_img
      : [];

    // Handle file uploads
    // When using upload.fields, files are grouped by fieldname
    const highlightFile = Array.isArray(req.files?.highlight_img)
      ? req.files.highlight_img[0]
      : undefined;
    const detailFiles = Array.isArray(req.files?.detail_img)
      ? req.files.detail_img
      : [];

    if (highlightFile) {
      const uploaded = await uploadBufferToCloudinary(highlightFile.buffer, {
        folder: "products/highlight",
      });
      highlightUrl = uploaded.secure_url;
    }

    if (detailFiles && detailFiles.length > 0) {
      const uploads = await Promise.all(
        detailFiles.map((f) =>
          uploadBufferToCloudinary(f.buffer, { folder: "products/detail" })
        )
      );
      detailUrls = uploads.map((u) => u.secure_url);
    } else if (typeof req.body.detail_img === "string") {
      // allow comma-separated string
      detailUrls = req.body.detail_img
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    }

    // Prepare data
    const productPayload = {
      product_id: uuidv4(),
      uuid: userUuid,
      category_id,
      name,
      description: description || null,
      highlight_img: highlightUrl || null,
      detail_img: detailUrls,
      price: Number(price),
      condition,
      highlight_img,
      detail_img,
      total_qty,
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
    const product = await Product.create(productPayload);
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
      where: { product_id: req.params.id },
    });
    // Validation
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    // Authorization: only owner can update
    const requesterUserId = req.user?.id;
    if (!requesterUserId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (product.uuid !== requesterUserId) {
      return res
        .status(403)
        .json({ message: "Forbidden: you are not the owner of this product" });
    }

    // Handle file uploads for images
    let highlightUrl = product.highlight_img; // Keep existing if no new file
    let detailUrls = product.detail_img || []; // Keep existing if no new files

    // Handle highlight image upload
    const highlightFile = Array.isArray(req.files?.highlight_img)
      ? req.files.highlight_img[0]
      : undefined;
    if (highlightFile) {
      const uploaded = await uploadBufferToCloudinary(highlightFile.buffer, {
        folder: "products/highlight",
      });
      highlightUrl = uploaded.secure_url;
    }

    // Handle detail images upload
    const detailFiles = Array.isArray(req.files?.detail_img)
      ? req.files.detail_img
      : [];
    if (detailFiles && detailFiles.length > 0) {
      const uploads = await Promise.all(
        detailFiles.map((f) =>
          uploadBufferToCloudinary(f.buffer, { folder: "products/detail" })
        )
      );
      detailUrls = uploads.map((u) => u.secure_url);
    }

    // Prepare update data
    const updateData = { ...req.body };
    if (highlightUrl !== product.highlight_img) {
      updateData.highlight_img = highlightUrl;
    }
    if (detailUrls !== product.detail_img) {
      updateData.detail_img = detailUrls;
    }

    // Update
    await product.update(updateData);
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
      where: { product_id: req.params.id },
    });
    // Validation
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    // Authorization: only owner can delete
    const requesterUserId = req.user?.id;
    if (!requesterUserId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (product.uuid !== requesterUserId) {
      return res
        .status(403)
        .json({ message: "Forbidden: you are not the owner of this product" });
    }
    // Delete
    await product.destroy();
    // Return
    return res.status(200).json({
      message: "success",
      data: product,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// updateProductStatus removed. Use updateProduct to change status

const getProductsByUserId = async (req, res) => {
  try {
    const products = await Product.findAll({
      where: { uuid: req.params.user_id },
    });
    return res.status(200).json({
      message: "success",
      data: products,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const { Op } = require("sequelize");

const getProductsBySearch = async (req, res) => {
  try {
    const q = (req.query.q || "").trim();
    const categoryId = req.query.category_id
      ? String(req.query.category_id).trim()
      : undefined;
    const minPrice =
      req.query.min_price !== undefined
        ? Number(req.query.min_price)
        : undefined;
    const maxPrice =
      req.query.max_price !== undefined
        ? Number(req.query.max_price)
        : undefined;

    const where = {};
    if (q) {
      where.name = { [Op.like]: `%${q}%` };
    }
    if (categoryId) {
      where.category_id = categoryId;
    }
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (!Number.isNaN(minPrice) && minPrice !== undefined)
        where.price[Op.gte] = minPrice;
      if (!Number.isNaN(maxPrice) && maxPrice !== undefined)
        where.price[Op.lte] = maxPrice;
    }

    const products = await Product.findAll({ where });
    return res.status(200).json({ message: "success", data: products });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({
      attributes: ['category_id', 'category_name', 'category_icon']
    });
    
    return res.status(200).json({
      message: "success",
      data: categories,
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
  getProductsByUserId,
  getProductsBySearch,
  getAllCategories,
  // upload,
};
