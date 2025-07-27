import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line, Bar, Pie } from 'react-chartjs-2';
// Top of your Dashboard.jsx or a new file imported once in your project
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const API_URL = "http://localhost:5000/api/data";

const Dashboard = ({ token, onLogout }) => {
  const [data, setData] = useState([]);
  const [form, setForm] = useState({ date: '', revenue: 0, expenses: 0, profit: 0 });

  useEffect(() => {
    axios.get(API_URL, { headers: { Authorization: 'Bearer ' + token } })
      .then(res => setData(res.data));
  }, [token]);

  const addData = async (e) => {
    e.preventDefault();
    await axios.post(API_URL + '/add', form, { headers: { Authorization: 'Bearer ' + token } });
    setForm({ date: '', revenue: 0, expenses: 0, profit: 0 });
    const resp = await axios.get(API_URL, { headers: { Authorization: 'Bearer ' + token } });
    setData(resp.data);
  };

  const dates = data.map(d => d.date);
  const revenue = data.map(d => d.revenue);
  const expenses = data.map(d => d.expenses);
  const profit = data.map(d => d.profit);

  return (
    <div className="min-h-screen bg-gray-50 p-10">
      <div className="flex justify-end mb-4">
        <button className="px-4 py-2 bg-red-500 text-white rounded" onClick={onLogout}>Logout</button>
      </div>
      <form onSubmit={addData} className="flex space-x-2 mb-8">
        <input
          className="px-2 py-1 border rounded"
          placeholder="Date"
          value={form.date}
          onChange={e => setForm({ ...form, date: e.target.value })}
        />
        <input
          className="px-2 py-1 border rounded"
          placeholder="Revenue"
          type="number"
          value={form.revenue}
          onChange={e => setForm({ ...form, revenue: +e.target.value })}
        />
        <input
          className="px-2 py-1 border rounded"
          placeholder="Expenses"
          type="number"
          value={form.expenses}
          onChange={e => setForm({ ...form, expenses: +e.target.value })}
        />
        <input
          className="px-2 py-1 border rounded"
          placeholder="Profit"
          type="number"
          value={form.profit}
          onChange={e => setForm({ ...form, profit: +e.target.value })}
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-1 rounded">Add Data</button>
      </form>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white p-5 rounded shadow">
          <h2 className="text-lg font-bold mb-2">Financial Trends</h2>
          <Line data={{
            labels: dates,
            datasets: [
              { label: "Revenue", data: revenue, borderColor: "green" },
              { label: "Expenses", data: expenses, borderColor: "red" },
              { label: "Profit", data: profit, borderColor: "blue" }
            ]
          }} />
        </div>
        <div className="bg-white p-5 rounded shadow">
          <h2 className="text-lg font-bold mb-2">Revenue Comparison</h2>
          <Bar data={{
            labels: dates,
            datasets: [{ label: "Revenue", data: revenue, backgroundColor: "rgba(0,200,0,0.5)" }]
          }} />
        </div>
        <div className="bg-white p-5 rounded shadow">
          <h2 className="text-lg font-bold mb-2">Totals Breakdown</h2>
          <Pie data={{
            labels: ['Revenue', 'Expenses', 'Profit'],
            datasets: [{
              data: [revenue.reduce((a, b) => a + b, 0), expenses.reduce((a, b) => a + b, 0), profit.reduce((a, b) => a + b, 0)],
              backgroundColor: ['green', 'red', 'blue']
            }]
          }} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
