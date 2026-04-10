const Product = require("../models/Product");

// ✅ ADD PRODUCT (UPDATED FOR FIREBASE UID & IMAGE PATH)
exports.addProduct = async (req, res) => {
  try {
    const { name, price, category, description } = req.body;

    // Firebase uses 'uid', not 'id'. 
    // We get this from the authMiddleware (req.user = decodedToken)
    const sellerId = req.user.uid; 

    // Extract just the filename or the relative path for the database
    const imagePath = req.file ? `/uploads/${req.file.filename}` : "";

    if (!imagePath) {
      return res.status(400).json({ error: "Product image is required" });
    }

    const product = new Product({
  name: req.body.name,
  price: req.body.price,
  category: req.body.category,
  description: req.body.description,
  image: `/uploads/${req.file.filename}`, // ✅ FIX
  seller: req.user.uid, // ✅ ADD THIS (Firebase user)
});

    res.status(201).json(product);
  } catch (error) {
    console.error("MongoDB Create Error:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// ✅ GET ALL PRODUCTS
exports.getProducts = async (req, res) => {
  try {
    // Note: If 'seller' in your MongoDB is just a string (Firebase UID), 
    // .populate() will only work if you have a User model matching that UID.
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ GET SINGLE PRODUCT
exports.getProductById = async (req, res) => {
  try {
    const id = req.params.id;

    // 🔥 FIX: check valid MongoDB ObjectId
    if (!require("mongoose").Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid product ID" });
    }

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    console.error("GET PRODUCT ERROR:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// ✅ DELETE PRODUCT
exports.deleteProduct = async (req, res) => {
  try {
    // Optional: Add a check here to ensure req.user.uid === product.seller
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};