import React from 'react';
import { useNavigate } from 'react-router-dom';
import backgroundImage from '../assets/tailor-bg.jpg';
import {
  FaPhone,
  FaEnvelope,
  FaClock,
  FaFacebook,
  FaInstagram,
  FaTwitter
} from 'react-icons/fa';

function Landing() {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <div
        className="flex-grow h-screen bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="bg-black bg-opacity-70 w-full h-full flex items-center justify-center">
          <div className="text-center px-4 max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white drop-shadow-lg">
              Tailor Management System
            </h1>
            <p className="text-lg md:text-xl mb-8 text-white drop-shadow">
              Manage customers, orders, and payments all in one place.
            </p>
            <button
              onClick={() => navigate('/login')}
              className="bg-yellow-600 hover:bg-yellow-700 text-white font-semibold px-8 py-3 rounded-full transition duration-300 shadow-lg hover:shadow-xl"
            >
              Get Started
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-100 text-gray-800 w-full">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* About Us */}
            <div>
              <h2 className="text-xl font-bold mb-4 border-b pb-2">About Us</h2>
              <p className="text-sm">
                Professional tailoring management solution to streamline your business operations and enhance customer relationships.
              </p>
            </div>
            {/* Contact Us */}
            <div>
              <h2 className="text-xl font-bold mb-4 border-b pb-2">Contact Us</h2>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <FaPhone className="mt-1 mr-3 text-yellow-600" />
                  <div>
                    <p className="font-semibold">General Hotline</p>
                    <p>(011) 286 7511</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <FaEnvelope className="mt-1 mr-3 text-yellow-600" />
                  <div>
                    <p className="font-semibold">Email</p>
                    <p>info@tailorsystem.com</p>
                  </div>
                </li>
              </ul>
            </div>
            {/* Business Hours */}
            <div>
              <h2 className="text-xl font-bold mb-4 border-b pb-2">Business Hours</h2>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <FaClock className="mt-1 mr-3 text-yellow-600" />
                  <div>
                    <p className="font-semibold">Mon-Fri</p>
                    <p>9:00 AM - 6:00 PM</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <FaClock className="mt-1 mr-3 text-yellow-600" />
                  <div>
                    <p className="font-semibold">Saturday</p>
                    <p>9:00 AM - 2:00 PM</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Social Icons */}
          <div className="flex justify-center space-x-6 mb-8">
            <a href="#" className="text-2xl text-gray-700 hover:text-yellow-600">
              <FaFacebook />
            </a>
            <a href="#" className="text-2xl text-gray-700 hover:text-yellow-600">
              <FaInstagram />
            </a>
            <a href="#" className="text-2xl text-gray-700 hover:text-yellow-600">
              <FaTwitter />
            </a>
          </div>

          {/* Copyright */}
          <div className="border-t pt-4 text-center text-sm">
            <p>© {currentYear} Tailor Management System. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Landing;
