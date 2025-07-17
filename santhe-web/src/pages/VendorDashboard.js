// src/pages/VendorDashboard.js
import React, { useState, useEffect } from "react";
import axios from "axios";

function VendorDashboard() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState({ name: "", price: "" });

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user || user.role !== "vendor") {
      alert("Access denied");
      window.location.href = "/vendor/login";
    }
    fetchProducts();
    fetchOrders();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/products?vendorId=${user._id}`
      );
      setProducts(res.data);
    } catch (err) {
      console.error("Fetch products error", err);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/orders/vendor", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data);
    } catch (err) {
      console.error("Fetch orders error", err);
    }
  };

  const addProduct = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5000/api/products",
        { ...form },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Product added");
      setForm({ name: "", price: "" });
      fetchProducts();
    } catch (err) {
      alert("Add failed");
      console.error(err);
    }
  };

  const deleteProduct = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchProducts();
    } catch (err) {
      alert("Delete failed");
      console.error(err);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Vendor Dashboard</h2>

      <h3>Add Product</h3>
      <form onSubmit={addProduct}>
        <input
          name="name"
          placeholder="Product name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          name="price"
          placeholder="Price"
          type="number"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          required
        />
        <button type="submit">Add</button>
      </form>

      <h3>Your Products</h3>
      <ul>
        {products.map((prod) => (
          <li key={prod._id}>
            {prod.name} - ₹{prod.price}
            <button onClick={() => deleteProduct(prod._id)}>Delete</button>
          </li>
        ))}
      </ul>

      <h3>Customer Orders</h3>
      <ul>
        {orders.map((order) => (
          <li key={order._id}>
            📦 Product: {order.product.name} <br />
            👤 Customer: {order.user.name} ({order.user.phone}) <br />
            📍 Location: [{order.user.location[1]}, {order.user.location[0]}]
          </li>
        ))}
      </ul>
    </div>
  );
}

export default VendorDashboard;
