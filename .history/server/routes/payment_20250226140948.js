const router = require('express').Router();
const moment = require('moment');
const config = require('../config/paymentConfig');
const crypto = require('crypto');
const querystring = require('qs');
const https = require('https');

router.post('/create_payment_url', function (req, res) {
    const method = req.body.method;
    const amount = req.body.amount;
    const orderId = moment().format('DDHHmmss');
    const orderInfo = `Thanh toan cho ma GD: ${orderId}`;
    const ipAddr = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;

    if (method === 'vnpay') {
        createVnpayPaymentUrl(amount, orderId, orderInfo, ipAddr, res);
    } else if (method === 'momo') {
        createMomoPaymentUrl(amount, orderId, orderInfo, ipAddr, res);
    } else {
        res.status(400).json({ error: 'Invalid payment method' });
    }
});

function createVnpayPaymentUrl(amount, orderId, orderInfo, ipAddr, res) {
    const vnp_Params = {
        'vnp_Version': '2.1.0',
        'vnp_Command': 'pay',
        'vnp_TmnCode': config.vnpay.tmnCode,
        'vnp_Locale': 'vn',
        'vnp_CurrCode': 'VND',
        'vnp_TxnRef': orderId,
        'vnp_OrderInfo': orderInfo,
        'vnp_OrderType': 'other',
        'vnp_Amount': amount * 100,
        'vnp_ReturnUrl': config.vnpay.returnUrl,
        'vnp_IpAddr': ipAddr,
        'vnp_CreateDate': moment().format('YYYYMMDDHHmmss')
    };

    const sortedParams = sortObject(vnp_Params);
    const signData = querystring.stringify(sortedParams, { encode: false });
    const hmac = crypto.createHmac('sha512', config.vnpay.hashSecret);
    const signed = hmac.update(new Buffer.from(signData, 'utf-8')).digest('hex');
    sortedParams['vnp_SecureHash'] = signed;
    const vnpUrl = config.vnpay.url + '?' + querystring.stringify(sortedParams, { encode: false });

    res.redirect(vnpUrl);
}

function createMomoPaymentUrl(amount, orderId, orderInfo, ipAddr, res) {
    const requestId = orderId;
    const rawSignature = `accessKey=${config.momo.accessKey}&amount=${amount}&extraData=&ipnUrl=${config.momo.ipnUrl}&orderId=${orderId}&orderInfo=${orderInfo}&partnerCode=${config.momo.partnerCode}&redirectUrl=${config.momo.redirectUrl}&requestId=${requestId}&requestType=payWithMethod`;
    const signature = crypto.createHmac('sha256', config.momo.secretKey).update(rawSignature).digest('hex');
    const requestBody = JSON.stringify({
        partnerCode: config.momo.partnerCode,
        partnerName: "Test",
        storeId: "MomoTestStore",
        requestId: requestId,
        amount: amount,
        orderId: orderId,
        orderInfo: orderInfo,
        redirectUrl: config.momo.redirectUrl,
        ipnUrl: config.momo.ipnUrl,
        requestType: "payWithMethod",
        autoCapture: true,
        extraData: "",
        signature: signature
    });

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
        momoRes.on('data', chunk => responseData += chunk);
        momoRes.on('end', () => {
            const result = JSON.parse(responseData);
            if (result.resultCode === 0) {
                res.json({ paymentUrl: result.payUrl });
            } else {
                res.status(400).json({ error: result.message });
            }
        });
    });

    momoReq.on('error', e => res.status(500).json({ error: e.message }));
    momoReq.write(requestBody);
    momoReq.end();
}

function sortObject(obj) {
    const sorted = {};
    const str = [];
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            str.push(encodeURIComponent(key));
        }
    }
    str.sort();
    for (const key of str) {
        sorted[key] = encodeURIComponent(obj[key]).replace(/%20/g, "+");
    }
    return sorted;
}

module.exports = router;