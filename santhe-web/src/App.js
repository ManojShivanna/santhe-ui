import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import UserDashboard from "./pages/UserDashboard";
import VendorDashboard from "./pages/VendorDashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage role="user" />} />
        <Route path="/vendor/login" element={<LoginPage role="vendor" />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/user" element={<UserDashboard />} />
        <Route path="/vendor" element={<VendorDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
