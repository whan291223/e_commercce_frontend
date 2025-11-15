import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from "./components/navbar";
import AdminDashboard from "./components/admin/AdminDashboard";

import './App.css'

function App() {
  
  return (
    <Router>
      <Navbar>
        <main className="container">
          <Routes>
            <Route path="/"></Route>
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </main>
      </Navbar>
    </Router>
  )
}

export default App
