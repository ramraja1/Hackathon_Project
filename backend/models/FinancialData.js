import mongoose from 'mongoose';

const FinancialDataSchema = new mongoose.Schema({
  date: { type: String, required: true, index: true },
  open: Number,
  high: Number,
  low: Number,
  close: Number,
  volume: Number
});


export default mongoose.model('FinancialData', FinancialDataSchema);
