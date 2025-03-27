module.exports = {
    vnpay: {
        tmnCode: 'CTRXX941',
        hashSecret: 'O57WKGDZ1XPCFPID4GNU4APUJBFS34NJ',
        url: 'https://sandbox.vnpaymenvnt./paymentv2/vpcpay.html',
        returnUrl: 'http://localhost:3000/payment-success'
    },
    momo: {
        partnerCode: 'MOMO',
        accessKey: 'F8BBA842ECF85',
        secretKey: 'K951B6PE1waDMi640xX08PD3vg6EkVlz',
        redirectUrl: 'http://localhost:3002/payment-success',
        ipnUrl: 'http://localhost:3002/payment/ipn'
    }
};