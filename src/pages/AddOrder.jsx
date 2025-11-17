import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';

function AddOrder() {
  const [order, setOrder] = useState({
    tod_order_id: '',
    tod_order_clothingType: '',
    tod_order_fabrics: '',
    tod_order_orderDate: '',
    tod_order_dueDate: '',
    tod_order_design: '',
    tod_customer_teleNo: ''
  });

  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch('/api/customers');
        if (!response.ok) throw new Error('Failed to fetch customers');
        const data = await response.json();
        setCustomers(data);
      } catch (error) {
        console.error('Error fetching customers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOrder(prev => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};

    if (!order.tod_order_id) newErrors.tod_order_id = 'Order ID is required';
    if (!order.tod_order_clothingType) newErrors.tod_order_clothingType = 'Clothing type is required';
    if (!order.tod_order_fabrics) newErrors.tod_order_fabrics = 'Fabric is required';
    if (!order.tod_order_orderDate) newErrors.tod_order_orderDate = 'Order date is required';
    if (!order.tod_order_dueDate) newErrors.tod_order_dueDate = 'Due date is required';
    if (!order.tod_order_design) newErrors.tod_order_design = 'Design is required';
    if (!order.tod_customer_teleNo) newErrors.tod_customer_teleNo = 'Customer is required';

    if (order.tod_order_orderDate && order.tod_order_dueDate) {
      const orderDate = new Date(order.tod_order_orderDate);
      const dueDate = new Date(order.tod_order_dueDate);
      if (dueDate < orderDate) newErrors.tod_order_dueDate = 'Due date cannot be before order date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(order)
      });

      if (!response.ok) throw new Error('Failed to create order');

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      setOrder({
        tod_order_id: '',
        tod_order_clothingType: '',
        tod_order_fabrics: '',
        tod_order_orderDate: '',
        tod_order_dueDate: '',
        tod_order_design: '',
        tod_customer_teleNo: ''
      });
    } catch (error) {
      console.error('Error creating order:', error);
      setErrors({ submit: 'Failed to create order. Please try again.' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New Order</h2>

          {success && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">Order added successfully!</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Order Information</h3>
                {renderInput('tod_order_id', 'Order ID *', 'text', 'ORD-001')}
                {renderSelect('tod_order_clothingType', 'Clothing Type *', [
                  '', 'Shirt', 'Pants', 'Dress', 'Skirt', 'Jacket', 'Other'
                ])}
                {renderInput('tod_order_fabrics', 'Fabric *', 'text', 'Cotton, Silk, etc.')}
                {renderTextarea('tod_order_design', 'Design Description *', 'Describe the design details...')}
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Dates & Customer</h3>
                {renderInput('tod_order_orderDate', 'Order Date *', 'date')}
                {renderInput('tod_order_dueDate', 'Due Date *', 'date')}
                {loading ? (
                  <div className="animate-pulse">Loading customers...</div>
                ) : (
                  renderSelect('tod_customer_teleNo', 'Customer *', customers.map(c => `${c.tcd_customer_name} (${c.tcd_customer_teleNo})`), customers.map(c => c.tcd_customer_teleNo))
                )}
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Add Order
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  function renderInput(id, label, type = 'text', placeholder = '') {
    return (
      <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">{label}</label>
        <input
          type={type}
          id={id}
          name={id}
          value={order[id]}
          onChange={handleChange}
          placeholder={placeholder}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${errors[id] ? 'border-red-500' : 'border'}`}
        />
        {errors[id] && <p className="mt-1 text-sm text-red-600">{errors[id]}</p>}
      </div>
    );
  }

  function renderTextarea(id, label, placeholder = '', rows = 3) {
    return (
      <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">{label}</label>
        <textarea
          id={id}
          name={id}
          value={order[id]}
          onChange={handleChange}
          rows={rows}
          placeholder={placeholder}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${errors[id] ? 'border-red-500' : 'border'}`}
        ></textarea>
        {errors[id] && <p className="mt-1 text-sm text-red-600">{errors[id]}</p>}
      </div>
    );
  }

  function renderSelect(id, label, labels, values = labels) {
    return (
      <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">{label}</label>
        <select
          id={id}
          name={id}
          value={order[id]}
          onChange={handleChange}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${errors[id] ? 'border-red-500' : 'border'}`}
        >
          <option value="">Select an option</option>
          {values.map((val, i) => (
            <option key={val} value={val}>{labels[i]}</option>
          ))}
        </select>
        {errors[id] && <p className="mt-1 text-sm text-red-600">{errors[id]}</p>}
      </div>
    );
  }
}

export default AddOrder;
