const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  customer: String,              // ✅ ADD
  sellerId: String,              // ✅ ADD
  items: Array,
  total: Number,                 // ✅ CHANGE (remove totalAmount)
  status: {
    type: String,
    default: "Processing",
  },
  date: {
    type: String,
    default: () => new Date().toLocaleDateString(),
  },
  paymentId: String,
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);