import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

// Pages
import Landing from "./pages/Landing";
import UnifiedLogin from "./pages/UnifiedLogin";
import Dashboard from "./pages/Dashboard";
import Tailors from "./pages/Tailors";
import Measurements from "./pages/Measurements";
import Orders from "./pages/Orders";
import OrderItems from "./pages/OrderItems";
import Payments from "./pages/Payments";
import Customers from "./pages/Customers";
import FabricTypes from "./pages/FabricTypes";
import GarmentTypes from "./pages/GarmentTypes";
import Assignments from "./pages/Assignments";
import Admin from "./pages/Admin";
import Report from "./pages/Report";
import RentalCloths from "./pages/RentalCloths";
import Categories from "./pages/Categories";
import RentalTransactions from "./pages/RentalTransactions";

// Layout
import Layout from "./components/Layout";

// Unified PrivateRoute
const PrivateRoute = ({ children, requiredRole }) => {
  const { user, loading } = useSelector((state) => state.unifiedLogin);
  
  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }
  
  if (!user || !user.token) {
    return <Navigate to="/login" />;
  }
  
  // Check role if required
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" />;
  }
  
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<UnifiedLogin />} />

        {/* Protected Routes - Accessible based on role */}
        <Route
          path="/*"
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          {/* Common routes for both roles */}
          {/* <Route path="dashboard" element={<Dashboard />} /> */}
          <Route path="orders" element={<Orders />} />
          <Route path="assignments" element={<Assignments />} />
          <Route path="measurements" element={<Measurements />} />
          
          {/* Admin only routes */}
          <Route 
            path="admin-dashboard" 
            element={
              <PrivateRoute requiredRole="admin">
                <Dashboard />
              </PrivateRoute>
            } 
          />
          <Route 
            path="admin-orders" 
            element={
              <PrivateRoute requiredRole="admin">
                <Orders />
              </PrivateRoute>
            } 
          />
          <Route 
            path="admin-order-items" 
            element={
              <PrivateRoute requiredRole="admin">
                <OrderItems />
              </PrivateRoute>
            } 
          />
          <Route 
            path="admin-customers" 
            element={
              <PrivateRoute requiredRole="admin">
                <Customers />
              </PrivateRoute>
            } 
          />
          <Route 
            path="admin-payments" 
            element={
              <PrivateRoute requiredRole="admin">
                <Payments />
              </PrivateRoute>
            } 
          />
          <Route 
            path="admin-fabric-types" 
            element={
              <PrivateRoute requiredRole="admin">
                <FabricTypes />
              </PrivateRoute>
            } 
          />
          <Route 
            path="admin-garment-types" 
            element={
              <PrivateRoute requiredRole="admin">
                <GarmentTypes />
              </PrivateRoute>
            } 
          />
          <Route 
            path="admin-measurements" 
            element={
              <PrivateRoute requiredRole="admin">
                <Measurements />
              </PrivateRoute>
            } 
          />
          <Route 
            path="admin-assignments" 
            element={
              <PrivateRoute requiredRole="admin">
                <Assignments />
              </PrivateRoute>
            } 
          />
          <Route 
            path="admin-tailors" 
            element={
              <PrivateRoute requiredRole="admin">
                <Tailors />
              </PrivateRoute>
            } 
          />
          <Route 
  path="admin-reports" 
  element={
    <PrivateRoute requiredRole="admin">
      <Report />
    </PrivateRoute>
  } 
/>
          <Route 
            path="admins" 
            element={
              <PrivateRoute requiredRole="admin">
                <Admin />
              </PrivateRoute>
            } 
          />

<Route 
            path="admin-rental-cloths" 
            element={
              <PrivateRoute requiredRole="admin">
                <RentalCloths />
              </PrivateRoute>
            } 
          />

          <Route 
  path="admin-rental-transactions" 
  element={
    <PrivateRoute requiredRole="admin">
      <RentalTransactions />
    </PrivateRoute>
  } 
/>

          <Route 
            path="admin-categories" 
            element={
              <PrivateRoute requiredRole="admin">
                <Categories />
              </PrivateRoute>
            } 
          />

        </Route>
        

        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;