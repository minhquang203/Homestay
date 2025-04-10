const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Người thêm vào danh sách
  listingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing', required: true },
  hostId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Người đăng bài
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  totalPrice: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Trip', tripSchema);