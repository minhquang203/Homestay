const express = require("express");
const crypto = require("crypto");
const https = require("https");
const axios = require("axios"); // Đảm bảo bạn cài axios
const router = express.Router();

// Thông tin cấu hình MoMo
const accessKey = 'F8BBA842ECF85';
const secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
const partnerCode = 'MOMO';
const orderInfo = 'pay with MoMo';
const redirectUrl = 'https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b';
const ipnUrl = 'https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b';
const requestType = "payWithMethod";
const lang = 'vi';
const autoCapture = true;
const extraData = '';
let orderId = partnerCode + new Date().getTime();
let requestId = orderId;

// Hệ thống xử lý tạo chữ ký
const generateSignature = (params) => {
    const rawSignature = "accessKey=" + accessKey + "&amount=" + params.amount + "&extraData=" + extraData +
                         "&ipnUrl=" + ipnUrl + "&orderId=" + orderId + "&orderInfo=" + orderInfo +
                         "&partnerCode=" + partnerCode + "&redirectUrl=" + redirectUrl + "&requestId=" + requestId +
                         "&requestType=" + requestType;

    return crypto
        .createHmac('sha256', secretKey)
        .update(rawSignature)
        .digest('hex')
        .toUpperCase();
};

// Route xử lý thanh toán MoMo
router.post("/momo", async (req, res) => {
    // Lấy các tham số từ request
    const { amount } = req.body;

    // Tạo chữ ký cho yêu cầu thanh toán
    const signature = generateSignature({ amount });

    // Tạo yêu cầu gửi đến MoMo API
    const paymentRequest = {
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
        requestType,
        autoCapture,
        extraData,
        signature,
    };

    // Gửi yêu cầu đến MoMo API để tạo link thanh toán
    try {
        const momoResponse = await axios.post('https://test-payment.momo.vn/v2/gateway/api/create', paymentRequest);
        
        // Kiểm tra kết quả trả về từ MoMo
        if (momoResponse.data.resultCode === "0") {
            // Thành công, trả về paymentUrl để chuyển hướng người dùng đến trang thanh toán
            res.json({ paymentUrl: momoResponse.data.payUrl });
        } else {
            // Nếu có lỗi, trả về mã lỗi
            res.status(400).json({ error: momoResponse.data.message });
        }
    } catch (error) {
        // Xử lý lỗi
        res.status(500).json({ error: "Error while processing payment request." });
    }
});

// Xử lý IPN (Instant Payment Notification)
router.post("/momo/ipn", (req, res) => {
    const { orderId, resultCode, message } = req.body;

    // Kiểm tra kết quả thanh toán từ MoMo
    if (resultCode === "0") {
        // Thanh toán thành công, cập nhật cơ sở dữ liệu hoặc các hành động khác
        console.log(`Payment success for Order ID: ${orderId}`);
        res.status(200).send("Success");
    } else {
        // Thanh toán thất bại
        console.log(`Payment failed for Order ID: ${orderId}. Message: ${message}`);
        res.status(400).send("Failed");
    }
});

// Hàm xác thực chữ ký và xử lý yêu cầu thanh toán từ phía client
router.post("/momo/verify", (req, res) => {
    const { signature, ...params } = req.body;

    // Tạo lại chữ ký từ các tham số
    const generatedSignature = generateSignature(params);

    // So sánh chữ ký
    if (signature === generatedSignature) {
        res.status(200).json({ message: "Signature verified successfully" });
    } else {
        res.status(400).json({ error: "Invalid signature" });
    }
});

module.exports = router;
