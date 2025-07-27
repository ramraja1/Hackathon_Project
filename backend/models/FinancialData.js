import mongoose from 'mongoose';

const FinancialDataSchema = new mongoose.Schema({
  date: String,
  revenue: Number,
  expenses: Number,
  profit: Number
});

export default mongoose.model('FinancialData', FinancialDataSchema);
