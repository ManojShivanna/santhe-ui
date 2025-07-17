// src/pages/RegisterPage.js
import React, { useState, useEffect } from "react";
import axios from "axios";

function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    password: "",
    role: "user",
    location: { lat: null, lng: null },
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const getLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm((prev) => ({
          ...prev,
          location: {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          },
        }));
      },
      (err) => {
        alert("Could not get your location.");
        console.error(err);
      }
    );
  };

  useEffect(() => {
    getLocation();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.location.lat || !form.location.lng) {
      alert("Location not yet loaded.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", {
        name: form.name,
        phone: form.phone,
        password: form.password,
        role: form.role,
        location: [form.location.lng, form.location.lat],
      });

      alert("Registration successful!");
      window.location.href = "/login";
    } catch (err) {
      console.error(err);
      alert("Registration failed: " + (err.response?.data?.error || ""));
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto" }}>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" onChange={handleChange} required />
        <input name="phone" placeholder="Phone" onChange={handleChange} required />
        <input name="password" placeholder="Password" type="password" onChange={handleChange} required />
        <select name="role" onChange={handleChange}>
          <option value="user">User</option>
          <option value="vendor">Vendor</option>
        </select>
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default RegisterPage;
