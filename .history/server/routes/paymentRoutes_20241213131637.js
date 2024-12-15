// server/routes/paymentRoutes.js
const express = require("express");
const router = express.Router();
const crypto = require("crypto"); // Dùng cho chữ ký MoMo
const https = require("https");   // Gửi yêu cầu đến MoMo API

const accessKey = 'F8BBA842ECF85';
const secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
const partnerCode = 'MOMO';
const orderInfo = 'pay with MoMo';
const redirectUrl = 'https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b'; 
const ipnUrl = 'https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b';

// Tạo đơn thanh toán MoMo
router.post("/momo", async (req, res) => {
    const { listingId, totalPrice, startDate, endDate } = req.body;

    if (!listingId || !totalPrice) {
        return res.status(400).json({ error: 'Missing payment information' });
    }

    const amount = totalPrice;
    const orderId = partnerCode + new Date().getTime();
    const requestId = orderId;
    const extraData = ''; // Dữ liệu thêm nếu cần
    const autoCapture = true;
    const lang = 'vi'; // Ngôn ngữ

    // Tạo chữ ký HMAC SHA256
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
        lang,
        requestType: "payWithMethod",
        autoCapture,
        extraData,
        signature
    });

    // Tạo đối tượng HTTPS để gửi yêu cầu tới MoMo
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
                // Thanh toán thành công, gửi URL thanh toán
                res.json({ paymentUrl: result.payUrl });
            } else {
                // Xử lý lỗi
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
