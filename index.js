import express from "express";
import axios from "axios";

const app = express();
const USER_SERVICE_URL = "https://user-service.onrender.com";
const PRODUCT_SERVICE_URL = "https://product-service.onrender.com";

app.get("/api/orders/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await axios.get(`${USER_SERVICE_URL}/api/users/1`);
    const product = await axios.get(`${PRODUCT_SERVICE_URL}/api/products/1`);
    res.json({
      id,
      user: user.data,
      product: product.data,
      total: product.data.price,
      status: "confirmed"
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch order details" });
  }
});

app.listen(3002, () => console.log("Order Service running on port 3002"));
