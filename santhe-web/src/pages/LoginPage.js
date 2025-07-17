// src/pages/LoginPage.js
import React, { useState } from "react";
import axios from "axios";

function LoginPage({ role }) {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        phone,
        password,
      });

      const { token, user } = res.data;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      alert("Login successful!");

      if (user.role === "vendor") {
        window.location.href = "/vendor";
      } else {
        window.location.href = "/user";
      }
    } catch (err) {
      alert("Login failed");
      console.error(err.response?.data);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto" }}>
      <h2>{role} Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default LoginPage;
