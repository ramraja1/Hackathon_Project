import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement, LineElement, PointElement,
  Title, Tooltip, Legend
} from 'chart.js';

// Register required Chart elements
ChartJS.register(
  CategoryScale, LinearScale, BarElement, LineElement, PointElement,
  Title, Tooltip, Legend
);

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/data";

const Dashboard = ({ token, onLogout }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [importing, setImporting] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [error, setError] = useState('');

  // Fetch all data
  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(API_URL, { headers: { Authorization: 'Bearer ' + token } });
      setData(res.data.sort((a, b) => new Date(a.date) - new Date(b.date))); // sort oldest to latest
    } catch {
      setError("Could not fetch data.");
    }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, [token]);

  // Import from API
  const importFromApi = async () => {
    setImporting(true);
    setError('');
    try {
      await axios.get(API_URL + '/fetch-from-api', { headers: { Authorization: 'Bearer ' + token } });
      await fetchData();
    } catch {
      setError("Import from API failed – check server/API key/rate limits!");
    }
    setImporting(false);
  };

  // Clear all data
  const clearAll = async () => {
    if (!window.confirm('Are you sure you want to delete all data?')) return;
    setClearing(true);
    setError('');
    try {
      await axios.delete(API_URL + '/clear', { headers: { Authorization: 'Bearer ' + token } });
      setData([]);
    } catch {
      setError("Failed to clear data.");
    }
    setClearing(false);
  };

  // Prepare chart data, reversed for chronological display
  const sorted = [...data].sort((a, b) => new Date(a.date) - new Date(b.date));
  const dates = sorted.map(d => d.date);
  const open = sorted.map(d => d.open);
  const high = sorted.map(d => d.high);
  const low = sorted.map(d => d.low);
  const close = sorted.map(d => d.close);
  const volume = sorted.map(d => d.volume);

  return (
    <div className="min-h-screen bg-gray-50 p-5 md:p-10">
      <div className="flex flex-col md:flex-row justify-between items-center gap-3 mb-6">
        <div className="flex gap-2">
          <button
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded shadow disabled:bg-blue-300"
            disabled={importing || loading}
            onClick={importFromApi}
          >
            {importing ? "Importing..." : "Import from API"}
          </button>
          <button
            className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded shadow disabled:bg-yellow-400"
            disabled={clearing || loading}
            onClick={clearAll}
          >
            {clearing ? "Clearing..." : "Clear All"}
          </button>
        </div>
        <button
          className="px-4 py-2 bg-red-500 hover:bg-red-700 text-white rounded shadow"
          onClick={onLogout}
        >
          Logout
        </button>
      </div>
      {error && <div className="mb-4 text-red-600 font-bold text-center">{error}</div>}
      {loading ? (
        <div className="text-center text-lg text-gray-500">Loading data...</div>
      ) : (
        data.length === 0 ? (
          <div className="text-center text-gray-600 mb-6">
            No data to display, please use <span className="font-semibold">Import from API</span>!
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            {/* Prices Chart */}
            <div className="bg-white p-5 rounded shadow">
              <h2 className="text-lg font-bold mb-2">IBM Daily Prices</h2>
              <Line data={{
                labels: dates,
                datasets: [
                  { label: "Open", data: open, borderColor: "orange", backgroundColor: "orange" },
                  { label: "High", data: high, borderColor: "green", backgroundColor: "green" },
                  { label: "Low", data: low, borderColor: "red", backgroundColor: "red" },
                  { label: "Close", data: close, borderColor: "blue", backgroundColor: "blue" }
                ]
              }} options={{
                responsive: true,
                interaction: { mode: "index", intersect: false },
                plugins: { legend: { position: "top" }, title: { display: false } }
              }} />
            </div>
            {/* Volume Bar Chart */}
            <div className="bg-white p-5 rounded shadow">
              <h2 className="text-lg font-bold mb-2">IBM Volume</h2>
              <Bar data={{
                labels: dates,
                datasets: [
                  { label: "Volume", data: volume, backgroundColor: "rgba(130, 130, 130, 0.7)" }
                ]
              }} options={{
                responsive: true,
                plugins: { legend: { display: false } }
              }} />
            </div>
          </div>
        )
      )}
      {/* Optional: Data table for inspection */}
      {data.length > 0 && (
        <div className="mt-12 overflow-x-auto">
          <h2 className="text-xl font-semibold mb-2">Recent Data</h2>
          <table className="min-w-full bg-white rounded shadow text-sm">
            <thead>
              <tr>
                <th className="py-2 px-3 text-left">Date</th>
                <th className="py-2 px-3">Open</th>
                <th className="py-2 px-3">High</th>
                <th className="py-2 px-3">Low</th>
                <th className="py-2 px-3">Close</th>
                <th className="py-2 px-3">Volume</th>
              </tr>
            </thead>
            <tbody>
              {sorted.slice(-30).reverse().map((row, i) => (
                <tr key={row.date}>
                  <td className="py-1 px-3">{row.date}</td>
                  <td className="py-1 px-3">{row.open}</td>
                  <td className="py-1 px-3">{row.high}</td>
                  <td className="py-1 px-3">{row.low}</td>
                  <td className="py-1 px-3">{row.close}</td>
                  <td className="py-1 px-3">{row.volume}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
