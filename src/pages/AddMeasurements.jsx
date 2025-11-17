import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import backgroundImage from '../assets/tailor-bg.jpg';
import Navbar from '../components/Navbar';

function AddMeasurement() {
  const navigate = useNavigate();

  const [customers, setCustomers] = useState([]);
  const [garmentTypes, setGarmentTypes] = useState([]);

  const [measurement, setMeasurement] = useState({
    customerId: '',
    garmentTypeId: '',
    neck: '',
    chest: '',
    waist: '',
    hip: '',
    shoulderWidth: '',
    length: '',
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function fetchDropdownData() {
      try {
        const customersRes = await fetch('/api/customers');
        const customersData = await customersRes.json();
        setCustomers(customersData);

        const garmentTypesRes = await fetch('/api/garmenttypes');
        const garmentTypesData = await garmentTypesRes.json();
        setGarmentTypes(garmentTypesData);
      } catch (error) {
        console.error('Failed to fetch dropdown data:', error);
      }
    }
    fetchDropdownData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMeasurement((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!measurement.customerId) newErrors.customerId = 'Customer is required';
    else if (isNaN(measurement.customerId)) newErrors.customerId = 'Invalid customer selection';

    if (!measurement.garmentTypeId) newErrors.garmentTypeId = 'Garment type is required';
    else if (isNaN(measurement.garmentTypeId)) newErrors.garmentTypeId = 'Invalid garment type selection';

    const fields = ['neck', 'chest', 'waist', 'hip', 'shoulderWidth', 'length'];
    fields.forEach((field) => {
      if (!measurement[field]) newErrors[field] = 'Required';
      else if (isNaN(measurement[field])) newErrors[field] = 'Must be a number';
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      console.log('Submitting measurement:', measurement);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);

      setMeasurement({
        customerId: '',
        garmentTypeId: '',
        neck: '',
        chest: '',
        waist: '',
        hip: '',
        shoulderWidth: '',
        length: '',
      });
    }
  };

  const InputField = ({ id, label }) => (
    <div className="mb-4">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">{label}</label>
      <input
        type="text"
        id={id}
        name={id}
        value={measurement[id]}
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
            <button
              onClick={() => navigate(-1)}
              className="absolute top-4 left-4 text-gray-700 hover:text-yellow-600"
            >
              <FaArrowLeft className="text-xl" />
            </button>

            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Add Measurements</h2>

            {success && (
              <div className="mb-4 p-3 bg-green-100 text-green-700 rounded text-center">
                Measurements added successfully!
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Measurement Info</h3>

              {/* Customer Dropdown */}
              <div className="mb-4">
                <label htmlFor="customerId" className="block text-sm font-medium text-gray-600">Customer</label>
                <select
                  id="customerId"
                  name="customerId"
                  value={measurement.customerId}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                    errors.customerId ? 'border-red-500 border' : 'border-gray-300 border'
                  } ${measurement.customerId === '' ? 'text-gray-400' : 'text-black'}`}
                >
                  <option value="" disabled hidden>Select Customer</option>
                  {customers.map((c) => (
                    <option key={c.CustomerId} value={c.CustomerId}>
                      {c.FullName}
                    </option>
                  ))}
                </select>
                {errors.customerId && <p className="mt-1 text-sm text-red-600">{errors.customerId}</p>}
              </div>

              {/* Garment Type Dropdown */}
              <div className="mb-4">
                <label htmlFor="garmentTypeId" className="block text-sm font-medium text-gray-600">Garment Type</label>
                <select
                  id="garmentTypeId"
                  name="garmentTypeId"
                  value={measurement.garmentTypeId}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                    errors.garmentTypeId ? 'border-red-500 border' : 'border-gray-300 border'
                  } ${measurement.garmentTypeId === '' ? 'text-gray-400' : 'text-black'}`}
                >
                  <option value="" disabled hidden>Select Garment Type</option>
                  {garmentTypes.map((g) => (
                    <option key={g.GarmentTypeId} value={g.GarmentTypeId}>
                      {g.Name}
                    </option>
                  ))}
                </select>
                {errors.garmentTypeId && <p className="mt-1 text-sm text-red-600">{errors.garmentTypeId}</p>}
              </div>

              <h3 className="text-lg font-semibold text-gray-700 mb-4 border-b pb-2">Body Measurements (cm)</h3>

              <InputField id="neck" label="Neck" />
              <InputField id="chest" label="Chest" />
              <InputField id="waist" label="Waist" />
              <InputField id="hip" label="Hip" />
              <InputField id="shoulderWidth" label="Shoulder Width" />
              <InputField id="length" label="Sleeve Length" />

              <div className="text-center mt-6">
                <button
                  type="submit"
                  className="inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Save Measurements
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddMeasurement;
