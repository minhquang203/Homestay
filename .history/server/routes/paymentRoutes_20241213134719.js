const express = require("express");
const crypto = require("crypto");
const https = require("https");
const axios = require("axios"); // Đảm bảo bạn cài axios
const router = express.Router();

// Lấy thông tin từ biến môi trường
const accessKey = process.env.MOMO_ACCESS_KEY;
const secretKey = process.env.MOMO_SECRET_KEY;
const partnerCode = process.env.MOMO_PARTNER_CODE;
const redirectUrl = process.env.MOMO_REDIRECT_URL;
const ipnUrl = process.env.MOMO_IPN_URL;
const orderInfo = process.env.MOMO_ORDER_INFO;
const lang = 'vi'; // Bạn có thể tùy chỉnh lang nếu cần

// Chữ ký MoMo
const rawSignature = "accessKey=" + accessKey + "&amount=" + amount + "&extraData=" + extraData + 
                     "&ipnUrl=" + ipnUrl + "&orderId=" + orderId + "&orderInfo=" + orderInfo + 
                     "&partnerCode=" + partnerCode + "&redirectUrl=" + redirectUrl + "&requestId=" + requestId + 
                     "&requestType=" + requestType;

const signature = crypto.createHmac('sha256', secretKey)
    .update(rawSignature)
    .digest('hex');

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
