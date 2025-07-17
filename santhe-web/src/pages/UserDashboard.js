// src/pages/UserDashboard.js
import React, { useEffect, useState } from "react";
import axios from "axios";

function UserDashboard() {
  const [vendors, setVendors] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [products, setProducts] = useState([]);
  const [location, setLocation] = useState({ lat: null, lng: null });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || user.role !== "user") {
      alert("Access denied");
      window.location.href = "/login";
    }
    getLocation();
  }, []);

  const getLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      (err) => {
        alert("Location access denied");
        console.error(err);
      }
    );
  };

  const fetchNearbyVendors = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/products/nearby-vendors", {
        lat: location.lat,
        lng: location.lng,
      });
      setVendors(res.data);
    } catch (err) {
      console.error("Error fetching vendors:", err);
    }
  };

  const fetchProducts = async (vendorId) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/products?vendorId=${vendorId}`);
      setProducts(res.data);
      setSelectedVendor(vendorId);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  const placeOrder = async (productId) => {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.post(
        "http://localhost:5000/api/orders",
        { productId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Order placed successfully!");
    } catch (err) {
      console.error("Error placing order:", err);
      alert("Failed to place order.");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>User Dashboard</h2>
      <button onClick={fetchNearbyVendors}>🔍 Find Nearby Vendors</button>

      {vendors.length > 0 && (
        <div>
          <h3>Nearby Vendors</h3>
          <ul>
            {vendors.map((vendor) => (
              <li key={vendor._id}>
                {vendor.name} - {vendor.phone}
                <button onClick={() => fetchProducts(vendor._id)}>View Products</button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {products.length > 0 && (
        <div>
          <h3>Products from Vendor</h3>
          <ul>
            {products.map((prod) => (
              <li key={prod._id}>
                {prod.name} - ₹{prod.price}
                <button onClick={() => placeOrder(prod._id)}>Buy</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default UserDashboard;
