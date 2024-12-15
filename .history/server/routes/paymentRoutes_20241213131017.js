const Payment = require("../models/payment");
const express = require("express");
const router = express.Router();


// Route MoMo payment
router.post("/momo", async (req, res) => {
  const { userId, amount, orderId } = req.body;

  if (!userId || !amount || !orderId) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // Lưu giao dịch ban đầu
    const newPayment = new Payment({
      orderId,
      userId,
      amount,
    });
    await newPayment.save();

    // Tạo request tới MoMo
    const requestId = `${partnerCode}_${Date.now()}`;
    const rawSignature = `accessKey=${accessKey}&amount=${amount}&extraData=&ipnUrl=${ipnUrl}&orderId=${orderId}&orderInfo=Thanh toán MoMo&partnerCode=${partnerCode}&redirectUrl=${redirectUrl}&requestId=${requestId}&requestType=captureWallet`;
    const signature = crypto.createHmac("sha256", secretKey).update(rawSignature).digest("hex");

    const requestBody = JSON.stringify({
      partnerCode,
      requestId,
      amount,
      orderId,
      orderInfo: "Thanh toán MoMo",
      redirectUrl,
      ipnUrl,
      requestType: "captureWallet",
      extraData: "",
      signature,
    });

    const options = {
      hostname: "test-payment.momo.vn",
      port: 443,
      path: "/v2/gateway/api/create",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(requestBody),
      },
    };

    const momoReq = https.request(options, (momoRes) => {
      let responseData = "";

      momoRes.on("data", (chunk) => {
        responseData += chunk;
      });

      momoRes.on("end", async () => {
        const result = JSON.parse(responseData);

        if (result.resultCode === 0) {
          // Cập nhật URL MoMo vào database
          await Payment.findOneAndUpdate(
            { orderId },
            { momoResponse: result, status: "pending" }
          );
          res.json({ paymentUrl: result.payUrl });
        } else {
          res.status(400).json({ error: result.message });
        }
      });
    });

    momoReq.on("error", (error) => {
      console.error("MoMo API error:", error.message);
      res.status(500).json({ error: "MoMo API error" });
    });

    momoReq.write(requestBody);
    momoReq.end();
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
