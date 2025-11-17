import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import backgroundImage from '../assets/tailor-bg.jpg';
import Navbar from '../components/Navbar';

function AddCustomer() {
  const navigate = useNavigate();

  const [customer, setCustomer] = useState({
    tcd_customer_name: '',
    tcd_customer_teleNo: '',
    tcd_customer_email: '',
    tcd_customer_address: ''
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomer((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!customer.tcd_customer_teleNo) newErrors.tcd_customer_teleNo = 'Telephone number is required';
    else if (!/^\d{10,15}$/.test(customer.tcd_customer_teleNo)) newErrors.tcd_customer_teleNo = 'Invalid phone number';

    if (!customer.tcd_customer_name) newErrors.tcd_customer_name = 'Name is required';

    if (!customer.tcd_customer_email) {
      newErrors.tcd_customer_email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(customer.tcd_customer_email)) {
      newErrors.tcd_customer_email = 'Invalid email format';
    }

    if (!customer.tcd_customer_address) newErrors.tcd_customer_address = 'Address is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      console.log('Customer data:', customer);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      setCustomer({
        tcd_customer_name: '',
        tcd_customer_teleNo: '',
        tcd_customer_email: '',
        tcd_customer_address: ''
      });
    }
  };

  const InputField = ({ id, label, type = 'text' }) => (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">{label}</label>
      <input
        type={type}
        id={id}
        name={id}
        value={customer[id]}
        onChange={handleChange}
        className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm focus:ring-blue-500 focus:border-blue-500 ${
          errors[id] ? 'border-red-500 border' : 'border-gray-300 border'
        }`}
      />
      {errors[id] && <p className="mt-1 text-sm text-red-600">{errors[id]}</p>}
    </div>
  );

  const TextAreaField = ({ id, label, rows = 3 }) => (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">{label}</label>
      <textarea
        id={id}
        name={id}
        rows={rows}
        value={customer[id]}
        onChange={handleChange}
        className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm focus:ring-blue-500 focus:border-blue-500 ${
          errors[id] ? 'border-red-500 border' : 'border-gray-300 border'
        }`}
      />
      {errors[id] && <p className="mt-1 text-sm text-red-600">{errors[id]}</p>}
    </div>
  );

  return (
    <div className="min-h-screen bg-cover bg-center" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="min-h-screen backdrop-blur-sm bg-white/20">
        <Navbar />

        <div className="flex justify-center items-center min-h-[85vh] p-6">
          <div className="bg-white rounded-xl shadow-lg p-10 w-full max-w-2xl relative">
            {/* Back Button */}
            <button
              onClick={() => navigate(-1)}
              className="absolute top-4 left-4 text-gray-700 hover:text-yellow-600"
            >
              <FaArrowLeft className="text-xl" />
            </button>

            {/* Title */}
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Add Customer</h2>

            {/* Success Message */}
            {success && (
              <div className="mb-4 p-3 bg-green-100 text-green-700 rounded text-center">
                Customer added successfully!
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Contact Information</h3>

              <InputField id="tcd_customer_teleNo" label="Telephone Number *" />
              <InputField id="tcd_customer_name" label="Full Name *" />
              <InputField id="tcd_customer_email" label="Email *" type="email" />
              <TextAreaField id="tcd_customer_address" label="Address *" />

              <div className="text-center mt-6">
                <button
                  type="submit"
                  className="inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Save Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddCustomer;
