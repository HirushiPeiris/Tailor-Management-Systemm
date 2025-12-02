import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";
import { unifiedLogoutAction } from "../actions/unifiedLoginActions";

const LogoutButton = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Dispatch unified logout action
    dispatch(unifiedLogoutAction());
    
    // Clear all user data from localStorage
    localStorage.removeItem("adminUser");
    localStorage.removeItem("tailorUser");
    localStorage.removeItem("user");
    
    // Redirect to unified login page
    navigate("/login");
  };

  return (
    <button
      onClick={handleLogout}
      className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 shadow-md"
    >
      <FiLogOut className="text-lg" />
      <span className="font-medium">Logout</span>
    </button>
  );
};

export default LogoutButton;