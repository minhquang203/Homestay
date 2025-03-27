
const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  listingId: { type: String, required: true },
  hostId: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  totalPrice: { type: Number, required: true },
  orderId: { type: String, required: true },
  status: { type: String, default: 'confirmed' },
});

module.exports = mongoose.model('Reservation', reservationSchema);