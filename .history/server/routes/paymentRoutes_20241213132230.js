// server/routes/paymentRoutes.js
const express = require("express");
const crypto = require("crypto");
const https = require("https");
const router = express.Router();

// Thông tin cấu hình MoMo
const accessKey = 'F8BBA842ECF85';
const secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
const partnerCode = 'MOMO';
const orderInfo = 'pay with MoMo';
const redirectUrl = 'http://localhost:3000/payment/success';  // URL quay lại sau thanh toán thành công
const ipnUrl = 'http://localhost:3000/payment/ipn';  // IPN URL để nhận thông báo từ MoMo

// Route xử lý thanh toán MoMo
router.post("/momo", async (req, res) => {
    const { listingId, totalPrice, startDate, endDate } = req.body;

    if (!listingId || !totalPrice) {
        return res.status(400).json({ error: 'Missing payment information' });
    }

    const amount = totalPrice;
    const orderId = partnerCode + new Date().getTime();  // Tạo orderId duy nhất
    const requestId = orderId;
    const extraData = ''; // Dữ liệu thêm nếu cần

    // Tạo chữ ký MoMo
    const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=payWithMethod`;

    const signature = crypto.createHmac('sha256', secretKey)
        .update(rawSignature)
        .digest('hex');

    const requestBody = JSON.stringify({
        partnerCode,
        partnerName: "Test",
        storeId: "MomoTestStore",
        requestId,
        amount,
        orderId,
        orderInfo,
        redirectUrl,
        ipnUrl,
        signature
    });

    // Gửi yêu cầu đến MoMo API
    const options = {
        hostname: 'test-payment.momo.vn',
        port: 443,
        path: '/v2/gateway/api/create',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(requestBody)
        }
    };

    const momoReq = https.request(options, momoRes => {
        let responseData = '';
        momoRes.setEncoding('utf8');
        momoRes.on('data', (chunk) => {
            responseData += chunk;
        });

        momoRes.on('end', () => {
            const result = JSON.parse(responseData);
            if (result.resultCode === 0) {
                // Thành công, trả về URL thanh toán
                res.json({ paymentUrl: result.payUrl });
            } else {
                res.status(400).json({ error: result.message });
            }
        });
    });

    momoReq.on('error', (e) => {
        res.status(500).json({ error: 'Error contacting MoMo API' });
    });

    momoReq.write(requestBody);
    momoReq.end();
});

module.exports = router;
