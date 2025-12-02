import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import backgroundImage from '../assets/registerbg.jpg';

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
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const generateTailorId = () => {
    const lastId = localStorage.getItem('lastTailorId') || 'TLR0000';
    const number = parseInt(lastId.replace('TLR', '')) + 1;
    const newId = `TLR${number.toString().padStart(4, '0')}`;
    localStorage.setItem('lastTailorId', newId);
    return newId;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTailor((prev) => ({ ...prev, [name]: value }));
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

    setLoading(true);
    try {
      const tailorId = generateTailorId();
      const tailorData = { ...tailor, tailor_id: tailorId };
      const existingTailors = JSON.parse(localStorage.getItem('tailors') || '[]');

      if (existingTailors.some((t) => t.tailor_email === tailor.tailor_email)) {
        alert('Email already registered. Please use a different email.');
        setLoading(false);
        return;
      }

      existingTailors.push(tailorData);
      localStorage.setItem('tailors', JSON.stringify(existingTailors));
      alert(`Registration successful. Your Tailor ID: ${tailorId}`);
      navigate('/login');
    } catch (error) {
      console.error('Registration error:', error);
      alert('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Side - Background Image */}
      <div
        className="lg:w-1/2 w-full h-64 lg:h-auto bg-cover bg-center"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      ></div>

      {/* Right Side - Form */}
      <div className="lg:w-1/2 w-full flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Glass card */}
          <div className="bg-white bg-opacity-80 backdrop-blur-md shadow-xl rounded-xl p-8 border border-gray-200 ring-1 ring-gray-300">
            {/* Back Button */}
            <button
              onClick={() => navigate(-1)}
              className="text-gray-500 hover:text-blue-500 flex items-center mb-4"
            >
              <FaArrowLeft className="mr-2" /> Back
            </button>

            {/* Header */}
            <h2 className="text-3xl font-bold text-gray-800 text-center mb-2">Tailor Registration</h2>
            <p className="text-sm text-center text-gray-500 mb-6">Create your admin account</p>

            {/* Form */}
            <form onSubmit={handleRegister} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  name="tailor_name"
                  value={tailor.tailor_name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className={`w-full px-4 py-3 border ${
                    errors.tailor_name ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {errors.tailor_name && <p className="text-sm text-red-500 mt-1">{errors.tailor_name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="tailor_email"
                  value={tailor.tailor_email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className={`w-full px-4 py-3 border ${
                    errors.tailor_email ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {errors.tailor_email && <p className="text-sm text-red-500 mt-1">{errors.tailor_email}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  type="password"
                  name="tailor_password"
                  value={tailor.tailor_password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`w-full px-4 py-3 border ${
                    errors.tailor_password ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {errors.tailor_password && (
                  <p className="text-sm text-red-500 mt-1">{errors.tailor_password}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  name="tailor_phone"
                  value={tailor.tailor_phone}
                  onChange={handleChange}
                  placeholder="1234567890"
                  className={`w-full px-4 py-3 border ${
                    errors.tailor_phone ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {errors.tailor_phone && <p className="text-sm text-red-500 mt-1">{errors.tailor_phone}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Skills</label>
                <input
                  type="text"
                  name="tailor_skills"
                  value={tailor.tailor_skills}
                  onChange={handleChange}
                  placeholder="Stitching, embroidery, etc."
                  className={`w-full px-4 py-3 border ${
                    errors.tailor_skills ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {errors.tailor_skills && <p className="text-sm text-red-500 mt-1">{errors.tailor_skills}</p>}
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 rounded-lg font-medium text-white transition ${
                  loading
                    ? 'bg-blue-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-500 shadow-md'
                }`}
              >
                {loading ? 'Registering...' : 'Register'}
              </button>
            </form>

            {/* Redirect to login */}
            <div className="text-center mt-6 text-sm text-gray-600">
              Already have an account?{' '}
              <button
                onClick={() => navigate('/login')}
                className="text-blue-600 hover:underline font-medium"
              >
                Sign in
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
