import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from "./components/navbar";
import AdminDashboard from "./components/admin/AdminDashboard";
import CustomerPage from "./components/customer/CustomerPage";
import './App.css'

function App() {
  
  return (
    <Router>
      {/* nav bar */}
      <Navbar />
      
      <main className="container">
        {/* Routing for admin view and customer view */}
        <Routes>
          <Route path="/" element={<CustomerPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </main>
    </Router>
  )
}

export default App
