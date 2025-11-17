import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';

function AddPayment() {
  const [payment, setPayment] = useState({
    tpd_payment_Id: '',
    tpd_payment_amount: '',
    tpd_payment_Date: '',
    tpd_customer_teleNo: ''
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
    setPayment(prev => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!payment.tpd_payment_Id) newErrors.tpd_payment_Id = 'Payment ID is required';
    if (!payment.tpd_payment_amount) {
      newErrors.tpd_payment_amount = 'Amount is required';
    } else if (isNaN(payment.tpd_payment_amount)) {
      newErrors.tpd_payment_amount = 'Amount must be a number';
    } else if (parseFloat(payment.tpd_payment_amount) <= 0) {
      newErrors.tpd_payment_amount = 'Amount must be positive';
    }
    if (!payment.tpd_payment_Date) newErrors.tpd_payment_Date = 'Payment date is required';
    if (!payment.tpd_customer_teleNo) newErrors.tpd_customer_teleNo = 'Customer is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...payment,
          tpd_payment_amount: parseFloat(payment.tpd_payment_amount)
        })
      });

      if (!response.ok) throw new Error('Failed to create payment');

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      setPayment({
        tpd_payment_Id: '',
        tpd_payment_amount: '',
        tpd_payment_Date: '',
        tpd_customer_teleNo: ''
      });
    } catch (error) {
      console.error('Error creating payment:', error);
      setErrors({ submit: 'Failed to create payment. Please try again.' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-md mx-auto p-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New Payment</h2>

          {success && (
            <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
              Payment added successfully!
            </div>
          )}

          {errors.submit && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
              {errors.submit}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="tpd_payment_Id" className="block text-sm font-medium text-gray-700">
                Payment ID *
              </label>
              <input
                type="text"
                id="tpd_payment_Id"
                name="tpd_payment_Id"
                value={payment.tpd_payment_Id}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${errors.tpd_payment_Id ? 'border-red-500' : 'border'}`}
                placeholder="PAY-001"
              />
              {errors.tpd_payment_Id && <p className="mt-1 text-sm text-red-600">{errors.tpd_payment_Id}</p>}
            </div>

            <div>
              <label htmlFor="tpd_payment_amount" className="block text-sm font-medium text-gray-700">
                Amount (LKR) *
              </label>
              <input
                type="text"
                id="tpd_payment_amount"
                name="tpd_payment_amount"
                value={payment.tpd_payment_amount}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${errors.tpd_payment_amount ? 'border-red-500' : 'border'}`}
                placeholder="0.00"
              />
              {errors.tpd_payment_amount && <p className="mt-1 text-sm text-red-600">{errors.tpd_payment_amount}</p>}
            </div>

            <div>
              <label htmlFor="tpd_payment_Date" className="block text-sm font-medium text-gray-700">
                Payment Date *
              </label>
              <input
                type="date"
                id="tpd_payment_Date"
                name="tpd_payment_Date"
                value={payment.tpd_payment_Date}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${errors.tpd_payment_Date ? 'border-red-500' : 'border'}`}
              />
              {errors.tpd_payment_Date && <p className="mt-1 text-sm text-red-600">{errors.tpd_payment_Date}</p>}
            </div>

            <div>
              <label htmlFor="tpd_customer_teleNo" className="block text-sm font-medium text-gray-700">
                Customer *
              </label>
              {loading ? (
                <div className="animate-pulse mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm py-2 px-3 border">
                  Loading customers...
                </div>
              ) : (
                <select
                  id="tpd_customer_teleNo"
                  name="tpd_customer_teleNo"
                  value={payment.tpd_customer_teleNo}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${errors.tpd_customer_teleNo ? 'border-red-500' : 'border'}`}
                >
                  <option value="">Select customer</option>
                  {customers.map(customer => (
                    <option key={customer.tcd_customer_teleNo} value={customer.tcd_customer_teleNo}>
                      {customer.tcd_customer_name} ({customer.tcd_customer_teleNo})
                    </option>
                  ))}
                </select>
              )}
              {errors.tpd_customer_teleNo && <p className="mt-1 text-sm text-red-600">{errors.tpd_customer_teleNo}</p>}
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Add Payment
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddPayment;
