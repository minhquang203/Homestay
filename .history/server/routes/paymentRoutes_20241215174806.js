// Backend (Node.js - Express Example)
app.post("/create_payment_url", async (req, res) => {
    const { amount, orderInfo } = req.body;
    
    try {
      // Tạo đơn hàng với VNPay
      const paymentUrl = await createVNPayUrl(amount, orderInfo);
  
      if (paymentUrl) {
        res.json({ paymentUrl });
      } else {
        res.status(400).json({ error: "Không thể tạo URL thanh toán." });
      }
    } catch (error) {
      console.error("Lỗi khi tạo URL thanh toán:", error);
      res.status(500).json({ error: "Lỗi server." });
    }
  });
  