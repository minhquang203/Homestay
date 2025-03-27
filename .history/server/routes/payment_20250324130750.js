require('dotenv').config(); // Load biến môi trường từ file .env

const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const moment = require('moment');
const querystring = require('qs');
const Booking = require('../models/Booking'); // Import model Booking

router.post('/create_payment_url', async (req, res) => {
  try {
    const { bookingId, totalPrice, customerId, bankCode } = req.body;
    if (!bookingId || !totalPrice || !customerId) {
      return res.status(400).json({ message: "Thông tin không đầy đủ" });
    }
    
    console.log(req.body); // Log dữ liệu nhận được từ client

    // Kiểm tra trạng thái của đơn đặt phòng
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Không tìm thấy đơn đặt phòng" });
    }
    if (booking.status !== "approved") {
      return res.status(400).json({ message: "Đơn đặt phòng chưa được duyệt" });
    }

    // Kiểm tra số tiền có khớp không
    if (Number(totalPrice) !== Number(booking.totalPrice)) {
      return res.status(400).json({ message: "Số tiền không khớp với đơn đặt phòng" });
    }

    // Kiểm tra người đặt có trùng khớp không (chuyển về chuỗi để so sánh)
    if (String(customerId) !== String(booking.customerId)) {
      return res.status(403).json({ message: "Người đặt không hợp lệ" });
    }

    process.env.TZ = 'Asia/Ho_Chi_Minh';

    const date