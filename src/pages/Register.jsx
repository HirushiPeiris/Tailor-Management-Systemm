import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import backgroundImage from '../assets/tailor-bg.jpg';

function Register() {
  const [tailor, setTailor] = useState({
    tailor_id: '',
    tailor_name: '',
    tailor_email: '',
    tailor_password: '',
    tailor_phone: '',
    tailor_skills: ''
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // ✅ Sequential Tailor ID Generator
  const generateTailorId = () => {
    const lastId = localStorage.getItem('lastTailorId') || 'TLR0000';
    const number = parseInt(lastId.replace('TLR', '')) + 1;
    const newId = `TLR${number.toString().padStart(4, '0')}`;
    localStorage.setItem('lastTailorId', newId);
    return newId;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTailor(prev => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!tailor.tailor_name.trim()) newErrors.tailor_name = 'Name is required';
    
    if (!tailor.tailor_email) {
      newErrors.tailor_email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(tailor.tailor_email)) {
      newErrors.tailor_email = 'Email is invalid';
    }
    
    if (!tailor.tailor_password) {
      newErrors.tailor_password = 'Password is required';
    } else if (tailor.tailor_password.length < 6) {
      newErrors.tailor_password = 'Password must be at least 6 characters';
    }
    
    if (!tailor.tailor_phone) {
      newErrors.tailor_phone = 'Phone number is required';
    } else if (!/^\d{10,15}$/.test(tailor.tailor_phone)) {
      newErrors.tailor_phone = 'Phone number must be 10-15 digits';
    }
    
    if (!tailor.tailor_skills.trim()) newErrors.tailor_skills = 'Skills are required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      const tailorId = generateTailorId();
      const tailorData = { 
        ...tailor, 
        tailor_id: tailorId,
        // Don't store password in plain text in a real app (use hashing)
      };

      // Check if email already exists
      const existingTailors = JSON.parse(localStorage.getItem('tailors') || '[]');
      const emailExists = existingTailors.some(t => t.tailor_email === tailor.tailor_email);
      
      if (emailExists) {
        alert('Email already registered. Please use a different email.');
        return;
      }

      // Save the new tailor
      existingTailors.push(tailorData);
      localStorage.setItem('tailors', JSON.stringify(existingTailors));

      alert(`Registration successful. Your Tailor ID: ${tailorId}`);
      navigate('/login');
    } catch (error) {
      console.error('Registration error:', error);
      alert('Registration failed. Please try again.');
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gray-100"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <form
        onSubmit={handleRegister}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md relative"
      >
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 text-gray-600 hover:text-yellow-600"
        >
          <FaArrowLeft className="text-xl" />
        </button>

        <h2 className="text-2xl mb-6 text-center font-semibold text-gray-800">
          Tailor Registration
        </h2>

        {/* Name */}
        <div className="mb-4">
          <label htmlFor="tailor_name" className="block text-sm font-medium mb-1 text-gray-700">
            Name
          </label>
          <input
            type="text"
            id="tailor_name"
            name="tailor_name"
            value={tailor.tailor_name}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md ${
              errors.tailor_name ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter full name"
          />
          {errors.tailor_name && (
            <p className="text-sm text-red-600 mt-1">{errors.tailor_name}</p>
          )}
        </div>

        {/* Email */}
        <div className="mb-4">
          <label htmlFor="tailor_email" className="block text-sm font-medium mb-1 text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="tailor_email"
            name="tailor_email"
            value={tailor.tailor_email}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md ${
              errors.tailor_email ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter email address"
          />
          {errors.tailor_email && (
            <p className="text-sm text-red-600 mt-1">{errors.tailor_email}</p>
          )}
        </div>

        {/* Password */}
        <div className="mb-4">
          <label htmlFor="tailor_password" className="block text-sm font-medium mb-1 text-gray-700">
            Password
          </label>
          <input
            type="password"
            id="tailor_password"
            name="tailor_password"
            value={tailor.tailor_password}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md ${
              errors.tailor_password ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Create password (min 6 characters)"
          />
          {errors.tailor_password && (
            <p className="text-sm text-red-600 mt-1">{errors.tailor_password}</p>
          )}
        </div>

        {/* Phone */}
        <div className="mb-4">
          <label htmlFor="tailor_phone" className="block text-sm font-medium mb-1 text-gray-700">
            Phone
          </label>
          <input
            type="tel"
            id="tailor_phone"
            name="tailor_phone"
            value={tailor.tailor_phone}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md ${
              errors.tailor_phone ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter phone number"
          />
          {errors.tailor_phone && (
            <p className="text-sm text-red-600 mt-1">{errors.tailor_phone}</p>
          )}
        </div>

        {/* Skills */}
        <div className="mb-6">
          <label htmlFor="tailor_skills" className="block text-sm font-medium mb-1 text-gray-700">
            Skills
          </label>
          <input
            type="text"
            id="tailor_skills"
            name="tailor_skills"
            value={tailor.tailor_skills}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md ${
              errors.tailor_skills ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="e.g. stitching, embroidery"
          />
          {errors.tailor_skills && (
            <p className="text-sm text-red-600 mt-1">{errors.tailor_skills}</p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200"
        >
          Register
        </button>
      </form>
    </div>
  );
}

export default Register;
