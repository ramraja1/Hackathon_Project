import express from 'express';
import FinancialData from '../models/FinancialData.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.post('/add', auth, async (req, res) => {
  const { date, revenue, expenses, profit } = req.body;
  const fd = new FinancialData({ date, revenue, expenses, profit });
  await fd.save();
  res.json(fd);
});

router.get('/', auth, async (req, res) => {
  const data = await FinancialData.find({});
  res.json(data);
});

export default router;
