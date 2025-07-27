import express from 'express';
import FinancialData from '../models/FinancialData.js'; // Update your model as above!
import auth from '../middleware/auth.js';
import axios from "axios";
const router = express.Router();

/**
 * Fetches TIME_SERIES_DAILY data from Alpha Vantage, normalizes and stores in MongoDB.
 */
router.get('/fetch-from-api', auth, async (req, res) => {
  try {
    const apiKey = process.env.ALPHAVANTAGE_KEY || "LJ6QHRFD2JJQHRC8";
    const symbol = "IBM";
    const apiUrl = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${apiKey}`;
    const apiRes = await axios.get(apiUrl);
    const raw = apiRes.data["Time Series (Daily)"];

    if (!raw) return res.status(400).json({ error: "No 'Time Series (Daily)' data in API result" });

    // Normalize and transform data
    const normalized = Object.entries(raw).map(([date, values]) => ({
      date,
      open: parseFloat(values["1. open"]),
      high: parseFloat(values["2. high"]),
      low: parseFloat(values["3. low"]),
      close: parseFloat(values["4. close"]),
      volume: parseInt(values["5. volume"], 10)
    }));

    // OPTIONAL: Remove old data / prevent duplicates by date if needed
    // await FinancialData.deleteMany({}); // uncomment to clear collection before inserting

    // Bulk insert; add { ordered: false } to skip duplicates if unique index on (date, symbol) is set
    await FinancialData.insertMany(normalized, { ordered: false }).catch(() => {});

    res.json({
      message: `${normalized.length} daily records imported!`,
      sample: normalized[0],
    });
  } catch (error) {
    console.error("[fetch-from-api]", error?.response?.data || error.message);
    res.status(500).json({ error: "Could not fetch or store external data" });
  }
});
// In your backend finance router:
router.delete('/clear', auth, async (req, res) => {
  await FinancialData.deleteMany({});
  res.json({ message: "All financial data cleared." });
});

router.get('/', auth, async (req, res) => {
  const data = await FinancialData.find({});
  res.json(data);
});
export default router;
