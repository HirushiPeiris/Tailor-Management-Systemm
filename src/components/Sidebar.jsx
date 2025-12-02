import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import {
  FiShoppingBag,
  FiUsers,
  FiCreditCard,
  FiClipboard,
  FiUser,
  FiList,
  FiFileText,
  FiMaximize2,
  FiMenu,
  FiChevronDown,
  FiChevronRight,
  FiX,
  FiBarChart2,
  FiPackage,
  FiUserPlus,
} from "react-icons/fi";
import { useSelector } from "react-redux";

const Sidebar = ({ onToggle }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  // Get user from unified login state
  const { user } = useSelector((state) => state.unifiedLogin);
  const role = user?.role || "tailor";

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      
      // On mobile, start with sidebar collapsed (hidden)
      if (mobile) {
        setIsCollapsed(true);
      } else {
        // On desktop, start with sidebar expanded
        setIsCollapsed(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleSidebar = () => {
    const newCollapsedState = !isCollapsed;
    setIsCollapsed(newCollapsedState);
    if (onToggle) onToggle(newCollapsedState);
  };

  const handleDropdownToggle = (menu) => {
    setOpenDropdown((prev) => (prev === menu ? null : menu));
  };

  const closeMobileSidebar = () => {
    if (isMobile) {
      setIsCollapsed(true);
      if (onToggle) onToggle(true);
    }
  };

  // Navigation Items
  const navItems = {
    admin: [
      { name: "Dashboard Overview", path: "/admin-dashboard", icon: <FiFileText /> },
      { name: "Customer Management", path: "/admin-customers", icon: <FiUsers /> },
      { name: "Order Management", path: "/admin-orders", icon: <FiShoppingBag /> },
      { name: "Assignments", path: "/admin-assignments", icon: <FiClipboard /> },
      { name: "Cash Payments", path: "/admin-payments", icon: <FiCreditCard /> },
      { name: "Sales Report", path: "/admin-reports", icon: <FiBarChart2 /> },
      // Removed "Tailor Management" and "Admin Management" from main navigation - now in dropdown
    ],
    tailor: [
      { name: "Assignments", path: "/assignments", icon: <FiClipboard /> },
      // { name: "Orders", path: "/orders", icon: <FiShoppingBag /> },
      { name: "Measurements", path: "/measurements", icon: <FiMaximize2 /> },
    ],
  };

  return (
    <>
      {/* Sidebar */}
      <div
        className={`bg-gray-900 text-white h-screen fixed top-0 left-0 flex flex-col transition-all duration-300 z-50 ${
          isMobile 
            ? (isCollapsed ? "-translate-x-full" : "translate-x-0 w-64")
            : (isCollapsed ? "w-16" : "w-64")
        }`}
      >
        {/* Header */}
        <div className="flex items-center p-4 border-b border-gray-700 flex-shrink-0">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-gray-800 transition-colors mr-3"
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isMobile ? (
              isCollapsed ? <FiMenu size={20} /> : <FiX size={20} />
            ) : (
              <FiMenu size={20} />
            )}
          </button>
          {!isCollapsed && <div className="text-xl sm:text-2xl font-bold">TailorPro</div>}
        </div>

        {/* Navigation */}
        <nav className="space-y-2 flex-1 p-2 mt-4 overflow-y-auto">
          {navItems[role]?.map(({ name, path, icon }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `flex items-center rounded-lg transition-all group relative ${
                  isActive ? "bg-blue-600 font-medium" : "hover:bg-gray-800"
                } ${
                  isCollapsed && !isMobile ? "p-3 justify-center" : "px-3 sm:px-4 py-3 space-x-3"
                }`
              }
              title={isCollapsed && !isMobile ? name : ""}
              onClick={closeMobileSidebar}
            >
              <span className="text-lg flex-shrink-0">{icon}</span>
              {(!isCollapsed || isMobile) && <span className="text-sm sm:text-base">{name}</span>}

              {/* Tooltip for collapsed state on desktop */}
              {isCollapsed && !isMobile && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-lg border border-gray-700">
                  {name}
                </div>
              )}
            </NavLink>
          ))}

          {/* Add User Dropdown - Admin Only */}
          {role === "admin" && (
            <div>
              <button
                onClick={() => handleDropdownToggle("user")}
                className={`w-full flex items-center justify-between rounded-lg transition-all ${
                  openDropdown === "user" ? "bg-blue-600" : "hover:bg-gray-800"
                } ${
                  isCollapsed && !isMobile ? "p-3 justify-center" : "px-3 sm:px-4 py-3 space-x-3"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <FiUserPlus size={18} className="flex-shrink-0" />
                  {(!isCollapsed || isMobile) && <span className="text-sm sm:text-base">User Management</span>}
                </div>
                {(!isCollapsed || isMobile) &&
                  (openDropdown === "user" ? (
                    <FiChevronDown size={16} />
                  ) : (
                    <FiChevronRight size={16} />
                  ))}
              </button>

              {/* Dropdown Links */}
              {openDropdown === "user" && (!isCollapsed || isMobile) && (
                <div className="ml-4 sm:ml-8 mt-2 space-y-1 transition-all duration-300">
                  <NavLink
                    to="/admin-tailors"
                    className={({ isActive }) =>
                      `block rounded-md px-3 sm:px-4 py-2 text-xs sm:text-sm ${
                        isActive ? "bg-blue-700 font-medium" : "hover:bg-gray-800"
                      }`
                    }
                    onClick={closeMobileSidebar}
                  >
                    Tailor Management
                  </NavLink>
                  <NavLink
                    to="/admins"
                    className={({ isActive }) =>
                      `block rounded-md px-3 sm:px-4 py-2 text-xs sm:text-sm ${
                        isActive ? "bg-blue-700 font-medium" : "hover:bg-gray-800"
                      }`
                    }
                    onClick={closeMobileSidebar}
                  >
                    Admin Management
                  </NavLink>
                </div>
              )}
            </div>
          )}

          {/* Cloth Management Dropdown - Admin Only */}
          {role === "admin" && (
            <div>
              <button
                onClick={() => handleDropdownToggle("cloth")}
                className={`w-full flex items-center justify-between rounded-lg transition-all ${
                  openDropdown === "cloth" ? "bg-blue-600" : "hover:bg-gray-800"
                } ${
                  isCollapsed && !isMobile ? "p-3 justify-center" : "px-3 sm:px-4 py-3 space-x-3"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <FiPackage size={18} className="flex-shrink-0" />
                  {(!isCollapsed || isMobile) && <span className="text-sm sm:text-base">Rentals</span>}
                </div>
                {(!isCollapsed || isMobile) &&
                  (openDropdown === "cloth" ? (
                    <FiChevronDown size={16} />
                  ) : (
                    <FiChevronRight size={16} />
                  ))}
              </button>

              {/* Dropdown Links */}
              {openDropdown === "cloth" && (!isCollapsed || isMobile) && (
                <div className="ml-4 sm:ml-8 mt-2 space-y-1 transition-all duration-300">
                  <NavLink
                    to="/admin-rental-cloths"
                    className={({ isActive }) =>
                      `block rounded-md px-3 sm:px-4 py-2 text-xs sm:text-sm ${
                        isActive ? "bg-blue-700 font-medium" : "hover:bg-gray-800"
                      }`
                    }
                    onClick={closeMobileSidebar}
                  >
                    Rental Cloths
                  </NavLink>
                  <NavLink
  to="/admin-rental-transactions"
  className={({ isActive }) =>
    `block rounded-md px-3 sm:px-4 py-2 text-xs sm:text-sm ${
      isActive ? "bg-blue-700 font-medium" : "hover:bg-gray-800"
    }`
  }
  onClick={closeMobileSidebar}
>
  Rental Transactions
</NavLink>
                  <NavLink
                    to="/admin-categories"
                    className={({ isActive }) =>
                      `block rounded-md px-3 sm:px-4 py-2 text-xs sm:text-sm ${
                        isActive ? "bg-blue-700 font-medium" : "hover:bg-gray-800"
                      }`
                    }
                    onClick={closeMobileSidebar}
                  >
                    Categories
                  </NavLink>
                  
                </div>
              )}
            </div>
          )}

          {/* Reports Dropdown - Admin Only */}
          {role === "admin" && (
            <div>
              <button
                onClick={() => handleDropdownToggle("reports")}
                className={`w-full flex items-center justify-between rounded-lg transition-all ${
                  openDropdown === "reports" ? "bg-blue-600" : "hover:bg-gray-800"
                } ${
                  isCollapsed && !isMobile ? "p-3 justify-center" : "px-3 sm:px-4 py-3 space-x-3"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <FiFileText size={18} className="flex-shrink-0" />
                  {(!isCollapsed || isMobile) && <span className="text-sm sm:text-base">Outfit Info</span>}
                </div>
                {(!isCollapsed || isMobile) &&
                  (openDropdown === "reports" ? (
                    <FiChevronDown size={16} />
                  ) : (
                    <FiChevronRight size={16} />
                  ))}
              </button>

              {/* Dropdown Links */}
              {openDropdown === "reports" && (!isCollapsed || isMobile) && (
                <div className="ml-4 sm:ml-8 mt-2 space-y-1 transition-all duration-300">
                  <NavLink
                    to="/admin-fabric-types"
                    className={({ isActive }) =>
                      `block rounded-md px-3 sm:px-4 py-2 text-xs sm:text-sm ${
                        isActive ? "bg-blue-700 font-medium" : "hover:bg-gray-800"
                      }`
                    }
                    onClick={closeMobileSidebar}
                  >
                    Fabric Types
                  </NavLink>
                  <NavLink
                    to="/admin-garment-types"
                    className={({ isActive }) =>
                      `block rounded-md px-3 sm:px-4 py-2 text-xs sm:text-sm ${
                        isActive ? "bg-blue-700 font-medium" : "hover:bg-gray-800"
                      }`
                    }
                    onClick={closeMobileSidebar}
                  >
                    Garment Types
                  </NavLink>
                  <NavLink
                    to="/measurements"
                    className={({ isActive }) =>
                      `block rounded-md px-3 sm:px-4 py-2 text-xs sm:text-sm ${
                        isActive ? "bg-blue-700 font-medium" : "hover:bg-gray-800"
                      }`
                    }
                    onClick={closeMobileSidebar}
                  >
                    Measurements
                  </NavLink>
                </div>
              )}
            </div>
          )}
        </nav>

        {/* User Info */}
        {(!isCollapsed || isMobile) && user && (
          <div className="p-3 sm:p-4 border-t border-gray-700 flex-shrink-0">
            <div className="text-xs sm:text-sm text-gray-300">
              <div className="font-medium capitalize text-sm sm:text-base">{role}</div>
              <div className="text-gray-400 truncate text-xs sm:text-sm">
                {user.email || user.username}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Overlay for mobile when sidebar is open */}
      {isMobile && !isCollapsed && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
          onClick={closeMobileSidebar}
        />
      )}

      {/* Floating Button for Mobile when sidebar is closed */}
      {isMobile && isCollapsed && (
        <button
          className="lg:hidden fixed top-2 left-2 z-50 p-3 bg-gray-900 text-white rounded-lg shadow-lg hover:bg-gray-800 transition-all duration-300"
          onClick={toggleSidebar}
          style={{
            minWidth: '44px',
            minHeight: '44px'
          }}
        >
          <FiMenu size={20} />
        </button>
      )}
    </>
  );
};

export default Sidebar;