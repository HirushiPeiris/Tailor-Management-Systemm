import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <nav className="bg-yellow-600 hover:bg-yellow-700 p-4 flex justify-between items-center">
      <div className="font-bold text-xl">Tailor Management System</div>
      <div className="space-x-12">
        <Link to="/dashboard" className="hover:underline">Dashboard</Link>
        <Link to="/add-customer" className="hover:underline">Add Customer</Link>
        <Link to="/add-measurements" className="hover:underline">Add Measurements</Link>
        <Link to="/add-order" className="hover:underline">Add Order</Link>
        <Link to="/add-payment" className="hover:underline">Add Payment</Link>
        <Link to="/view-data" className="hover:underline">View Data</Link>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-3 py-1 rounded"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
