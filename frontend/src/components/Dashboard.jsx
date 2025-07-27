import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, BarElement, LineElement, PointElement,
  Title, Tooltip, Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale, LinearScale, BarElement, LineElement, PointElement,
  Title, Tooltip, Legend
);

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/data";
const chartOptions = [
  { value: 'price', label: 'Daily Price Trends (Open/High/Low/Close)' },
  { value: 'volume', label: 'Trade Volume Bar Chart' },
  { value: 'open', label: 'Open Price Only (Line)' },
  { value: 'close', label: 'Close Price Only (Line)' }
];
const GITHUB_URL = "https://github.com/YOUR_GITHUB_REPO"; // <-- update with your repo URL

const Dashboard = ({ token, onLogout }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [importing, setImporting] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [error, setError] = useState('');
  const [selectedChart, setSelectedChart] = useState('price');
  const [fullScreen, setFullScreen] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(API_URL, { headers: { Authorization: 'Bearer ' + token } });
      setData(res.data.sort((a, b) => new Date(a.date) - new Date(b.date)));
    } catch {
      setError("Could not fetch data.");
    }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, [token]);

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

  const sorted = [...data].sort((a, b) => new Date(a.date) - new Date(b.date));
  const dates = sorted.map(d => d.date);
  const open = sorted.map(d => d.open);
  const high = sorted.map(d => d.high);
  const low = sorted.map(d => d.low);
  const close = sorted.map(d => d.close);
  const volume = sorted.map(d => d.volume);
  const latestDate = dates.length ? dates[dates.length - 1] : "-";

  // Chart Defs (used both normal and full mode)
  const chartDefs = {
    price: (
      <Line data={{
        labels: dates,
        datasets: [
          { label: "Open", data: open, borderColor: "#ff9800", backgroundColor: "#ffe0b2", tension: 0.2 },
          { label: "High", data: high, borderColor: "#1b5e20", backgroundColor: "#a5d6a7", tension: 0.2 },
          { label: "Low", data: low, borderColor: "#b71c1c", backgroundColor: "#ef9a9a", tension: 0.2 },
          { label: "Close", data: close, borderColor: "#1976d2", backgroundColor: "#bbdefb", tension: 0.2 }
        ]
      }} options={{ responsive: true, interaction: { mode: "index", intersect: false }, plugins: { legend: { position: "top" }, title: { display: false } } }} />
    ),
    volume: (
      <Bar data={{ labels: dates, datasets: [{ label: "Volume", data: volume, backgroundColor: "rgba(59,130,246,0.5)" }] }}
        options={{ responsive: true, plugins: { legend: { display: false } } }}
      />
    ),
    open: (
      <Line data={{ labels: dates, datasets: [{ label: "Open", data: open, borderColor: "#ff9800", backgroundColor: "#ffe0b2", tension: 0.2 }] }} />
    ),
    close: (
      <Line data={{ labels: dates, datasets: [{ label: "Close", data: close, borderColor: "#1976d2", backgroundColor: "#bbdefb", tension: 0.2 }] }} />
    ),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-blue-50 to-indigo-100">
      {/* Navigation Bar */}
      <nav className="bg-white shadow flex items-center justify-between p-4 sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <span className="text-2xl font-black text-blue-700 drop-shadow-sm">FinSight 📈</span>
          <span className="text-xs font-bold px-2 py-1 rounded bg-indigo-50 text-indigo-700 uppercase tracking-wide">
            Live Financial Data • IBM
          </span>
        </div>
        <div className="flex items-center gap-3">
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full hover:bg-gray-100 py-1 px-2 transition"
            title="View on GitHub"
            aria-label="GitHub Repository"
          >
            <svg className="w-5 h-5 inline text-gray-700 align-text-bottom" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12,0.5C5.4,0.5,0,5.7,0,12.2c0,5.2,3.3,9.5,7.9,11.1c0.6,0.1,0.8-0.2,0.8-0.5
               c0-0.2,0-0.9,0-1.7c-3.2,0.7-3.9-1.6-3.9-1.6c-0.5-1.3-1.2-1.7-1.2-1.7c-1-0.7,0.1-0.7,0.1-0.7c1,0.1,1.6,1,1.6,1
               c0.9,1.5,2.3,1.1,2.8,0.8c0.1-0.7,0.3-1.1,0.6-1.3c-2.6-0.3-5.2-1.3-5.2-5.9c0-1.3,0.5-2.3,1.2-3.2c-0.1-0.3-0.5-1.5,0.1-3
               c0,0,1-0.3,3.3,1.2c0.9-0.2,1.8-0.4,2.7-0.4c0.9,0,1.8,0.1,2.7,0.4c2.4-1.5,3.3-1.2,3.3-1.2c0.6,1.5,0.2,2.7,0.1,3
               c0.7,0.8,1.2,1.9,1.2,3.2c0,4.7-2.7,5.6-5.2,5.9c0.3,0.3,0.6,0.9,0.6,1.7c0,1.2,0,2.2,0,2.5c0,0.3,0.2,0.7,0.8,0.5
               C20.7,21.7,24,17.4,24,12.2C24,5.7,18.6,0.5,12,0.5z"/>
            </svg>
          </a>
          <button
            className="px-4 py-2 rounded bg-red-500 hover:bg-red-700 text-white font-bold shadow"
            onClick={onLogout}
          >
            Logout
          </button>
        </div>
      </nav>

      <section className="max-w-7xl mx-auto py-8 px-2">
        {/* Data Status Block */}
        <div className="bg-white rounded-lg shadow p-5 mb-7 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <div>
            <span className="text-lg font-bold text-blue-900">IBM Daily Stock Data</span>
            <span className="block text-sm text-gray-700">
              Powered by Alpha Vantage — <span className="font-semibold">Last update:</span> {latestDate}
            </span>
          </div>
          {data.length ? (
            <span className="inline-block px-3 py-1 rounded-full bg-green-100 text-green-800 font-semibold text-xs">
              Showing {data.length} days
            </span>
          ) : (
            <span className="inline-block px-3 py-1 rounded-full bg-gray-200 text-gray-700 font-semibold text-xs">
              No data loaded yet
            </span>
          )}
        </div>

        {/* Action Bar */}
        <div className="flex flex-col md:flex-row justify-between gap-4 items-start mb-6">
          <div className="flex gap-2">
            <button
              className="px-5 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow disabled:bg-blue-200"
              disabled={importing || loading}
              onClick={importFromApi}
            >
              {importing ? "Importing..." : "Import from API"}
            </button>
            <button
              className="px-5 py-2 rounded bg-yellow-500 hover:bg-yellow-600 text-white font-semibold shadow disabled:bg-yellow-200"
              disabled={clearing || loading}
              onClick={clearAll}
            >
              {clearing ? "Clearing..." : "Clear All"}
            </button>
          </div>
          <div className="flex gap-2 items-center">
            {/* Dropdown for chart selection */}
            <label className="text-sm font-semibold">Show as:</label>
            <select
              className="border rounded px-2 py-1"
              value={selectedChart}
              onChange={e => setSelectedChart(e.target.value)}
            >
              {chartOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <button
              className="ml-2 px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-800 text-white shadow"
              onClick={() => setFullScreen(true)}
              disabled={loading || data.length === 0}
            >
              Full Screen
            </button>
          </div>
        </div>

        {error && <div className="mb-4 text-red-600 font-bold text-center">{error}</div>}

        {/* Chart rendering */}
        {loading ? (
          <div className="text-center text-lg text-gray-500">Loading data...</div>
        ) : data.length === 0 ? (
          <div className="text-center text-gray-600 mb-6">
            No data to display, please use <span className="font-semibold">Import from API</span>!
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8" style={{ position: "relative" }}>
            {chartDefs[selectedChart]}
          </div>
        )}

        {/* FULL SCREEN MODAL for Chart */}
        {fullScreen && (
          <div className="fixed z-50 top-0 left-0 w-full h-full bg-black bg-opacity-90 flex justify-center items-center"
            style={{ backdropFilter: "blur(4px)" }}>
            <div className="absolute top-4 right-6 z-60">
              <button
                className="text-white text-4xl font-bold focus:outline-none"
                onClick={() => setFullScreen(false)}
                title="Close full screen"
              >&times;</button>
            </div>
            <div className="w-full max-w-5xl h-5/6 bg-white rounded shadow-lg flex flex-col overflow-hidden p-6">
              <div className="flex-1">
                {chartDefs[selectedChart]}
              </div>
            </div>
          </div>
        )}

        {/* Data Table */}
     {data.length > 0 && (
  <div className="mt-12 bg-white rounded-lg shadow-lg p-6">
    <h2 className="text-xl mb-4 font-semibold text-indigo-900">Recent 30 Days Data</h2>
    <div className="overflow-x-auto">
      <table className="min-w-full table-fixed border border-gray-300 border-collapse text-xs md:text-sm">
        <thead>
          <tr>
            <th className="py-2 px-3 border-b border-gray-300 text-left">Date</th>
            <th className="py-2 px-3 border-b border-gray-300">Open</th>
            <th className="py-2 px-3 border-b border-gray-300">High</th>
            <th className="py-2 px-3 border-b border-gray-300">Low</th>
            <th className="py-2 px-3 border-b border-gray-300">Close</th>
            <th className="py-2 px-3 border-b border-gray-300">Volume</th>
          </tr>
        </thead>
        <tbody>
          {sorted.slice(-30).reverse().map((row) => (
            <tr key={row.date} className="even:bg-indigo-50">
              <td className="py-1 px-3 border-b border-gray-200">{row.date}</td>
              <td className="py-1 px-3 border-b border-gray-200">{row.open}</td>
              <td className="py-1 px-3 border-b border-gray-200">{row.high}</td>
              <td className="py-1 px-3 border-b border-gray-200">{row.low}</td>
              <td className="py-1 px-3 border-b border-gray-200">{row.close}</td>
              <td className="py-1 px-3 border-b border-gray-200">{row.volume}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
)}


        <footer className="mt-16 text-center text-gray-400 text-sm">
          <hr className="my-6" />
          <div>
            &copy; {new Date().getFullYear()} <span className="font-bold text-blue-700">FinSight</span> &mdash; Hackathon Demo Dashboard <br />
            Data: Alpha Vantage &nbsp; | &nbsp; UI: Tailwind CSS &nbsp; | &nbsp; Charts: Chart.js
            <br />
            <span className="text-xs">Project open-sourced — <a href={GITHUB_URL} className="underline hover:text-black" target="_blank" rel="noopener noreferrer">see on GitHub</a></span>
          </div>
        </footer>
      </section>
    </div>
  );
};

export default Dashboard;
