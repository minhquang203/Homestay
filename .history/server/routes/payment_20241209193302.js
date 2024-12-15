const express = require("express");
const crypto = require("crypto");
const https = require("https");
const router = require("express").Router()

// API MoMo thông tin
const accessKey = 'F8BBA842ECF85';
const secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
const partnerCode = 'MOMO';
const orderInfo = 'pay with MoMo';
const redirectUrl = 'https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b'; // URL quay lại sau khi thanh toán thành công
const ipnUrl = 'https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b'; // IPN URL

// Dữ liệu thanh toán
const amount = '50000'; // Số tiền thanh toán
const orderId = partnerCode + new Date().getTime(); // Mã đơn hàng
const requestId = orderId;
const extraData = '';
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
const req = https.request(options, res => {
    console.log(`Status: ${res.statusCode}`);
    console.log(`Headers: ${JSON.stringify(res.headers)}`);
    res.setEncoding('utf8');
    res.on('data', (body) => {
        console.log('Body:', body);
        console.log('Result Code:', JSON.parse(body).resultCode);
    });
    res.on('end', () => {
        console.log('No more data in response.');
    });
});

// Xử lý lỗi
req.on('error', (e) => {
    console.error(`Problem with request: ${e.message}`);
});

// Gửi body dữ liệu
console.log("Sending request...");
req.write(requestBody);
req.end();
