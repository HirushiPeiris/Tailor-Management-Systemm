import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash, FaArrowLeft } from "react-icons/fa";
import backgroundImage from "../assets/loginbg1.jpg";
import { unifiedLoginAction, clearUnifiedLoginErrors } from "../actions/unifiedLoginActions";

function UnifiedLogin() {
  const [Email, setEmail] = useState("");
  const [PasswordHash, setPasswordHash] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, loading, error } = useSelector((state) => state.unifiedLogin);

  // Clean up old localStorage and errors on component mount
  useEffect(() => {
    localStorage.removeItem("adminUser");
    localStorage.removeItem("tailorUser");
    dispatch(clearUnifiedLoginErrors());
  }, [dispatch]);

  // Redirect based on role
  useEffect(() => {
    if (user && user.token) {
      if (user.role === "admin") {
        navigate("/admin-dashboard");
      } else if (user.role === "tailor") {
        navigate("/assignments");
      }
    }
  }, [user, navigate]);

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("Login submitted:", Email);
    dispatch(unifiedLoginAction(Email, PasswordHash));
  };

  const handleBack = () => {
    navigate("/");
  };

  const handleInputChange = () => {
    // Clear errors when user starts typing
    if (error) {
      dispatch(clearUnifiedLoginErrors());
    }
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center lg:justify-end bg-cover bg-center bg-fixed p-4 sm:p-6"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      {/* Mobile Overlay for better readability */}
      <div className="absolute inset-0 bg-black bg-opacity-40 lg:bg-opacity-0 pointer-events-none"></div>
      
      <div className="w-full max-w-md lg:max-w-xl lg:mr-4 xl:mr-20 relative z-10">
        {/* Back Button - Mobile Optimized */}
        <button
          onClick={handleBack}
          className="text-white hover:text-blue-300 flex items-center mb-4 lg:mb-6 transition-colors duration-200 text-sm lg:text-base bg-black bg-opacity-30 lg:bg-transparent px-3 py-2 lg:px-0 lg:py-0 rounded-lg lg:rounded-none"
        >
          <FaArrowLeft className="mr-2 text-xs lg:text-sm" /> 
          <span className="text-xs lg:text-base">Back to Home</span>
        </button>

        {/* Login Form Container */}
        <div className="bg-white bg-opacity-20 backdrop-blur-lg border border-white border-opacity-30 rounded-2xl lg:rounded-3xl shadow-2xl p-6 sm:p-8 lg:p-12">
          {/* Header */}
          <div className="text-center mb-6 lg:mb-8">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 lg:mb-4 drop-shadow-lg">
              Login to Your Account
            </h2>
            <p className="text-white text-opacity-90 text-sm lg:text-lg drop-shadow-sm">
              Enter your credentials to continue
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 lg:mb-6 text-red-300 text-xs sm:text-sm text-center bg-white bg-opacity-10 p-3 rounded-lg border border-red-400 border-opacity-30">
              {error}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6 lg:space-y-8">
            {/* Email Field */}
            <div>
              <label className="block text-base lg:text-lg font-medium text-white mb-2 lg:mb-3 drop-shadow-sm">
                Email Address
              </label>
              <input
                type="email"
                value={Email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  handleInputChange();
                }}
                placeholder="Enter your email"
                className="w-full px-4 lg:px-6 py-3 lg:py-4 border border-white border-opacity-40 rounded-xl lg:rounded-xl bg-white bg-opacity-10 text-white placeholder-white placeholder-opacity-70 text-base lg:text-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                required
                disabled={loading}
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-base lg:text-lg font-medium text-white mb-2 lg:mb-3 drop-shadow-sm">
                Password
              </label>
              <div className="relative">
                <input
                  type={passwordVisible ? "text" : "password"}
                  value={PasswordHash}
                  onChange={(e) => {
                    setPasswordHash(e.target.value);
                    handleInputChange();
                  }}
                  placeholder="Enter your password"
                  className="w-full px-4 lg:px-6 py-3 lg:py-4 border border-white border-opacity-40 rounded-xl lg:rounded-xl bg-white bg-opacity-10 text-white placeholder-white placeholder-opacity-70 text-base lg:text-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent pr-12 lg:pr-16 transition-all duration-200"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setPasswordVisible(!passwordVisible)}
                  className="absolute right-3 lg:right-5 top-1/2 transform -translate-y-1/2 text-white text-lg lg:text-xl hover:text-blue-300 transition-colors duration-200 p-1"
                  disabled={loading}
                >
                  {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 lg:py-4 rounded-xl font-bold text-white text-lg lg:text-xl transition-all duration-300 ${
                loading 
                  ? "bg-blue-500 cursor-not-allowed" 
                  : "bg-blue-700 hover:bg-blue-600 shadow-lg lg:shadow-xl hover:shadow-2xl transform hover:scale-105 active:scale-95"
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center text-sm lg:text-base">
                  <svg className="animate-spin -ml-1 mr-2 lg:mr-3 h-4 w-4 lg:h-5 lg:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Info Box */}
          <div className="mt-6 lg:mt-8 text-center">
            <div className="text-white text-xs sm:text-sm bg-black bg-opacity-30 p-3 lg:p-4 rounded-lg border border-white border-opacity-20">
              <div className="flex items-center justify-center mb-1 lg:mb-2">
                <span className="text-blue-300 mr-2">💡</span>
                <strong className="text-sm lg:text-base">Automatic Role Detection</strong>
              </div>
              <p className="text-white text-opacity-80 text-xs lg:text-sm leading-relaxed">
                The system will automatically detect if you're an Admin or Tailor
              </p>
            </div>
          </div>

          {/* Additional Mobile Help Text */}
          <div className="mt-4 lg:hidden text-center">
            <p className="text-white text-opacity-70 text-xs">
                Having trouble? Contact support
            </p>
          </div>
        </div>

        {/* Footer for larger screens */}
        <div className="hidden lg:block mt-4 text-center">
          <p className="text-white text-opacity-70 text-sm">
            Secure login system • Role-based access
          </p>
        </div>
      </div>

      {/* Mobile Bottom Spacing */}
      <div className="lg:hidden h-8"></div>
    </div>
  );
}

export default UnifiedLogin;