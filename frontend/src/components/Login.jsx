import React, { useState } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/auth";

const Login = ({ onLogin }) => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [err, setErr] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      if (isRegister) {
        await axios.post(`${API_URL}/register`, form);
        // Immediately login after successful register:
        const res = await axios.post(`${API_URL}/login`, form);
        localStorage.setItem('token', res.data.token);
        onLogin(res.data.token);
        setLoading(false);
        return;
      }
      const res = await axios.post(`${API_URL}/login`, form);
      localStorage.setItem('token', res.data.token);
      onLogin(res.data.token);
    } catch (error) {
      setErr(
        isRegister ? "Registration failed (username may exist or invalid input)." : "Invalid credentials"
      );
      setForm(f => ({ ...f, password: "" }));
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        {/* App Logo / Title */}
        <div className="flex flex-col items-center mb-6">
          <span className="text-4xl font-extrabold text-blue-700 tracking-tight mb-2">FinSight</span>
          <span className="uppercase text-xs font-bold text-blue-400 tracking-wide">
            {isRegister ? "Register" : "Login"} to your dashboard
          </span>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit} autoComplete="off">
          <input
            type="text"
            autoFocus
            placeholder="Username"
            className="w-full px-4 py-2 border rounded focus:outline-none focus:border-blue-400 transition"
            value={form.username}
            autoComplete="username"
            onChange={e => setForm({ ...form, username: e.target.value })}
            required
            disabled={loading}
          />
          <div className="relative">
            <input
              type={showPass ? "text" : "password"}
              placeholder="Password"
              className="w-full px-4 py-2 border rounded focus:outline-none focus:border-blue-400 transition pr-10"
              value={form.password}
              autoComplete={isRegister ? "new-password" : "current-password"}
              onChange={e => setForm({ ...form, password: e.target.value })}
              required
              disabled={loading}
              minLength={4}
            />
            <button
              type="button"
              onClick={() => setShowPass(v => !v)}
              tabIndex={-1}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600"
              aria-label={showPass ? "Hide password" : "Show password"}
            >
              {showPass
                ? (<svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2"
                      viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round"
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9-4-9-7s4-7 9-7 9 4 9 7c0 1.38-.655 2.855-1.875 4.175M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>)
                : (<svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2"
                      viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round"
                      d="M4.271 4.271l15.458 15.458M9.88 9.882A3 3 0 0115 12a3 3 0 01-4.879-2.118m6.362 6.362C19.635 15.181 21 13.532 21 12c0-3-4-7-9-7-1.61 0-3.137.385-4.47 1.062m1.681 1.682a9.977 9.977 0 00-4.211 4.729" /></svg>)
              }
            </button>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-blue-600 text-white font-bold rounded hover:bg-blue-700 transition-all shadow disabled:bg-blue-300"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-2 text-white"
                  viewBox="0 0 24 24" fill="none"><circle
                  className="opacity-25" cx="12" cy="12" r="10"
                  stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"></path>
                </svg>
                {isRegister ? "Registering..." : "Signing in..."}
              </span>
            ) : (
              isRegister ? "Register" : "Login"
            )}
          </button>
          <button
            type="button"
            onClick={() => { setIsRegister(v => !v); setErr(""); setForm({ ...form, password:"" }); }}
            className="w-full mt-3 text-blue-600 text-sm hover:underline font-semibold"
            disabled={loading}
          >
            {isRegister ? "Already have an account? Login" : "No account? Register"}
          </button>
        </form>
        {err && <p className="text-red-500 mt-4 text-center font-medium">{err}</p>}
        <div className="pt-6 text-center text-xs text-gray-400">
          &copy; {new Date().getFullYear()} FinSight — Alpha Vantage Financial Dashboard
        </div>
      </div>
    </div>
  );
};

export default Login;
