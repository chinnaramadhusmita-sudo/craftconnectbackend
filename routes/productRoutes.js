const express = require("express");
const router = express.Router();

const { addProduct, getProducts, getProductById } = require("../controllers/productController");
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/upload"); // ✅ IMPORTANT

// ✅ ADD PRODUCT WITH MULTER
router.post("/", authMiddleware, upload.single("image"), addProduct);

router.get("/", getProducts);
router.get("/:id", getProductById);
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const Product = require("../models/Product"); // ensure import
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;