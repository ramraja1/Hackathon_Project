// src/components/Login.jsx

import React, { useState } from 'react';
import axios from 'axios';

const Login = ({ onLogin }) => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [err, setErr] = useState("");
  const [isRegister, setIsRegister] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isRegister) {
        await axios.post('http://localhost:5000/api/auth/register', form);
      }
      const res = await axios.post('http://localhost:5000/api/auth/login', form);
      localStorage.setItem('token', res.data.token);
      onLogin(res.data.token);
    } catch {
      setErr(isRegister ? "Registration failed" : "Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form className="bg-white p-8 rounded shadow w-80" onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold mb-4 text-center">
          {isRegister ? "Register" : "Login"}
        </h2>
        <input
          type="text"
          placeholder="Username"
          className="mb-3 w-full px-3 py-2 border rounded"
          value={form.username}
          onChange={e => setForm({...form, username: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="mb-3 w-full px-3 py-2 border rounded"
          value={form.password}
          onChange={e => setForm({...form, password: e.target.value })}
          required
        />
        <button
          type="submit"
          className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          {isRegister ? "Register" : "Login"}
        </button>
        <button
          type="button"
          onClick={() => { setIsRegister(!isRegister); setErr(""); }}
          className="w-full mt-3 text-blue-700"
        >
          {isRegister ? "Already have an account? Login" : "No account? Register"}
        </button>
        {err && <p className="text-red-500 mt-3">{err}</p>}
      </form>
    </div>
  );
};

export default Login;
