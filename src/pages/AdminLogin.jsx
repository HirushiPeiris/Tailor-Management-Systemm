import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash, FaArrowLeft } from "react-icons/fa";
import backgroundImage from "../assets/loginbg1.jpg";
import { adminLoginAction } from "../actions/adminLoginActions";

function AdminLogin() {
  const [Email, setEmail] = useState("");
  const [PasswordHash, setPasswordHash] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, loading, error } = useSelector((state) => state.adminLogin);

  // Redirect if admin logged in
 useEffect(() => {
  if (user && user.token && user.role === "admin") {
    navigate("/admin-dashboard");
  }
}, [user, navigate]);


  const handleLogin = (e) => {
    e.preventDefault();
    dispatch(adminLoginAction(Email, PasswordHash));
  };

  const handleBack = () => navigate(-1);

  return (
    <div
      className="min-h-screen w-full flex items-center justify-end bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="w-full max-w-xl p-12 mr-20">
        <button
          onClick={handleBack}
          className="text-gray-200 hover:text-blue-400 flex items-center mb-6"
        >
          <FaArrowLeft className="mr-2" /> Back
        </button>

        <div className="bg-white bg-opacity-20 backdrop-blur-lg border border-white border-opacity-30 rounded-3xl shadow-2xl p-12">
          <h2 className="text-4xl font-bold text-center text-white mb-6 drop-shadow-lg">
            Admin Login
          </h2>

          {error && <div className="mb-4 text-red-400 text-sm text-center">{error}</div>}

          <form onSubmit={handleLogin} className="space-y-8">
            <div>
              <label className="block text-lg font-medium text-white mb-3 drop-shadow-sm">
                Email Address
              </label>
              <input
                type="email"
                value={Email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@email.com"
                className="w-full px-6 py-5 border border-white border-opacity-40 rounded-xl bg-white bg-opacity-10 text-white placeholder-white text-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>

            <div>
              <label className="block text-lg font-medium text-white mb-3 drop-shadow-sm">
                Password
              </label>
              <div className="relative">
                <input
                  type={passwordVisible ? "text" : "password"}
                  value={PasswordHash}
                  onChange={(e) => setPasswordHash(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-6 py-5 border border-white border-opacity-40 rounded-xl bg-white bg-opacity-10 text-white placeholder-white text-lg focus:outline-none focus:ring-2 focus:ring-blue-400 pr-16"
                  required
                />
                <button
                  type="button"
                  onClick={() => setPasswordVisible(!passwordVisible)}
                  className="absolute right-5 top-1/2 transform -translate-y-1/2 text-white text-xl"
                >
                  {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-5 rounded-xl font-bold text-white text-2xl transition ${
                loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-700 hover:bg-blue-600 shadow-xl"
              }`}
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
