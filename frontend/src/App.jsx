import React, { useState } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import "./App.css"

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token') || "");

  return !token
    ? <Login onLogin={setToken} />
    : <Dashboard token={token} onLogout={() => { setToken(""); localStorage.removeItem('token'); }} />;
};

export default App;
