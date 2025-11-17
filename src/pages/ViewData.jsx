import React from 'react';
import Navbar from '../components/Navbar';

function ViewData() {
  return (
    <div>
      <Navbar />
      <div className="p-8">
        <h2 className="text-xl font-bold">View Data</h2>
        {/* Display customer/order/payment data here */}
      </div>
    </div>
  );
}

export default ViewData;
