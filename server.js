const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");
const admin = require("firebase-admin");

// ✅ IMPORT DB
const connectDB = require("./config/db");

// ✅ IMPORT ROUTES
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const orderRoutes = require("./routes/orderRoutes");
const contactRoutes = require("./routes/contactRoutes");

dotenv.config();

// ✅ INITIALIZE FIREBASE ADMIN (For Token Verification)
const serviceAccount = require("./serviceAccountKey.json");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  console.log("Firebase Admin Initialized! ✅");
}

// ✅ CONNECT DATABASE
connectDB();

const app = express();

// ✅ MIDDLEWARES
app.use(cors());
app.use(express.json());

// ✅ ENSURE UPLOADS DIRECTORY EXISTS (Prevents "Folder not found" errors)
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// ✅🔥 VERY IMPORTANT (FIX IMAGE ISSUE)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);
app.use("/api/contact", contactRoutes);

// ✅ TEST ROUTE
app.get("/", (req, res) => {
  res.send("Craft Connect API Running 🚀");
});

// ✅ SERVER START
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});