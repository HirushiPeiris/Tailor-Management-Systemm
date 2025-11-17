import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from '../pages/Landing';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import AddCustomer from '../pages/AddCustomer';
import AddMeasurements from '../pages/AddMeasurements';
import AddOrder from '../pages/AddOrder';
import AddPayment from '../pages/AddPayment';
import ViewData from '../pages/ViewData';

function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/add-customer" element={<AddCustomer />} />
        <Route path="/add-measurements" element={<AddMeasurements />} />
        <Route path="/add-order" element={<AddOrder />} />
        <Route path="/add-payment" element={<AddPayment />} />
        <Route path="/view-data" element={<ViewData />} />
      </Routes>
    </Router>
  );
}

export default AppRoutes;
