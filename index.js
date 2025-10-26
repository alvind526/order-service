import express from "express";
import axios from "axios";

const app = express();

// use your actual Render URLs
const USER_SERVICE_URL = "https://user-service-76d3.onrender.com";
const PRODUCT_SERVICE_URL = "https://product-service-5bp2.onrender.com";

// simple retry helper (handles sleeping free-tier instances)
async function fetchWithRetry(url, tries = 3, delayMs = 3000) {
  for (let i = 1; i <= tries; i++) {
    try {
      const res = await axios.get(url, { timeout: 8000 });
      if (res && res.data) return res.data;
    } catch (e) {
      if (i === tries) throw e;
      await new Promise(r => setTimeout(r, delayMs));
    }
  }
}

app.get("/api/orders/:id", async (req, res) => {
  const { id } = req.params;
  try {
    // fetch user and product in parallel
    const [user, product] = await Promise.all([
      fetchWithRetry(`${USER_SERVICE_URL}/api/users/1`),
      fetchWithRetry(`${PRODUCT_SERVICE_URL}/api/products/1`)
    ]);

    res.json({
      id,
      user,
      product,
      total: product.price,
      status: "confirmed"
    });
  } catch (err) {
    // log details to Render logs for debugging
    console.error("Order error:", err?.response?.status, err?.message);
    res.status(500).json({ error: "Failed to fetch order details" });
  }
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log(`Order Service running on port ${PORT}`));
