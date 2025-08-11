const productDB = require('../models/productModel');
const cloudinary = require('../config/cloudinary');
const orderDB = require('../models/orderModel');

exports.createProduct = async (req, res) => {
  try {
    const { title, description, category, price, stock, tags } = req.body;

    if (!title || !description || !category || !price || !stock || !tags) {
      return res.status(400).json({ message: 'All feilds are required' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'Image is required' });
    }
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'ecommerce-products',
    });

    const product = new productDB({
      title,
      description,
      category,
      price,
      stock,
      tags,
      image: result.secure_url,
    }); await product.save();

    res.status(201).json({ message: 'Product created', product });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const { search, category, min, max, page = 1, limit = 10 } = req.query;

    const query = {};

    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    if (category) {
      query.category = category;
    }

    if (min || max) {
      query.price = {};
      if (min) query.price.$gte = Number(min);
      if (max) query.price.$lte = Number(max);
    }

    const skip = (page - 1) * limit;

    const products = await productDB
      .find(query)
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await productDB.countDocuments(query);

    res.json({
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      products,
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch products' });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const categories = await productDB.distinct('category');
    res.json(categories.map(c => ({ _id: c, name: c })));
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch categories' });
  }
};


exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await productDB.findById(id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching product' });
  }
}

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const product = await productDB.findById(id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    Object.assign(product, updates);
    await product.save();

    res.json({ message: 'Product updated', product });
  } catch (err) {
    res.status(500).json({ message: 'Error updating product' });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await productDB.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting product' });
  }
};

exports.getTopSellingProducts = async (req, res) => {
  try {
    const result = await orderDB.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.product",
          totalSold: { $sum: "$items.quantity" }
        }
      },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product"
        }
      },
      { $unwind: "$product" },
      { $sort: { totalSold: -1 } },
      { $limit: 5 }
    ]);

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch top selling products' });
  }
};

exports.getInventory = async (req, res) => {
  try {
    const products = await productDB.find({}, 'title stock');
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch inventory' });
  }
};

