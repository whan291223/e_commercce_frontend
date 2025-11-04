import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from "./components/navbar";


import './App.css'

function App() {
  
  return (
    <Router>
      <Navbar>
        <main className="container">
          <Routes>
            <Route path="/"></Route>
            <Route path="/admin"></Route>
          </Routes>
        </main>
      </Navbar>
    </Router>
  )
}

export default App
