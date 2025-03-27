module.exports = {
    vnpay: {
        tmnCode: 'K951B6PE1waDMi640xX08PD3vg6EkVlz',
        hashSecret: 'K951B6PE1waDMi640xX08PD3vg6EkVlz',
        url: 'YOUR_VNPAY_URL',
        returnUrl: 'YOUR_VNPAY_RETURN_URL'
    },
    momo: {
        partnerCode: 'MOMO',
        accessKey: 'F8BBA842ECF85',
        secretKey: 'K951B6PE1waDMi640xX08PD3vg6EkVlz',
        redirectUrl: 'http://localhost:3002/payment-success',
        ipnUrl: 'http://localhost:3002/payment/ipn'
    }
};