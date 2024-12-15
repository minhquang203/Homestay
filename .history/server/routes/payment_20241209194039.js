const express = require("express");
const crypto = require("crypto");
const https = require("https");
const router = express.Router();
const { createPayment, updatePaymentStatus } = require("./paymentController");

// API MoMo thông tin
const accessKey = 'F8BBA842ECF85';
const secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
const partnerCode = 'MOMO';
const orderInfo = 'pay with MoMo';
const redirectUrl = 'https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b';
const ipnUrl = 'https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b';

// API tạo đơn thanh toán
router.post("/momo", createPayment);

// API cập nhật trạng thái thanh toán (MoMo gửi thông báo về)
router.post("/status", updatePaymentStatus);

// Route xử lý thanh toán MoMo
router.post("/create-payment", (req, res) => {
    const amount = req.body.amount || '50000';  // Số tiền thanh toán
    const orderId = partnerCode + new Date().getTime(); // Mã đơn hàng
    const requestId = orderId;
    const extraData = ''; // Thêm nếu cần
    const autoCapture = true;
    const lang = 'vi'; // Ngôn ngữ

    // Tạo chữ ký HMAC SHA256
    const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=payWithMethod`;
    console.log("Raw Signature:", rawSignature);

    const signature = crypto.createHmac('sha256', secretKey)
        .update(rawSignature)
        .digest('hex');

    console.log("Signature:", signature);

    // Tạo body request gửi đi
    const requestBody = JSON.stringify({
        partnerCode: partnerCode,
        partnerName: "Test",
        storeId: "MomoTestStore",
        requestId: requestId,
        amount: amount,
        orderId: orderId,
        orderInfo: orderInfo,
        redirectUrl: redirectUrl,
        ipnUrl: ipnUrl,
        lang: lang,
        requestType: "payWithMethod",
        autoCapture: autoCapture,
        extraData: extraData,
        signature: signature
    });

    // Tạo đối tượng HTTPS
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

    // Gửi request và nhận phản hồi
    const momoReq = https.request(options, momoRes => {
        console.log(`Status: ${momoRes.statusCode}`);
        momoRes.setEncoding('utf8');
        let responseData = '';

        momoRes.on('data', (chunk) => {
            responseData += chunk;
        });

        momoRes.on('end', () => {
            console.log('Response Body:', responseData);
            const result = JSON.parse(responseData);
            if (result.resultCode === 0) {
                // Thanh toán thành công, điều hướng tới MoMo
                res.json({ paymentUrl: result.payUrl });
            } else {
                // Xử lý lỗi
                res.status(400).json({ error: result.message });
            }
        });
    });

    momoReq.on('error', (e) => {
        console.error(`Problem with request: ${e.message}`);
        res.status(500).json({ error: 'Error contacting MoMo API' });
    });

    momoReq.write(requestBody);
    momoReq.end();
});

module.exports = router;
