import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import LogoutButton from "./LogoutButton";
import { Outlet, useLocation } from "react-router-dom";

const Layout = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const location = useLocation();
  
  // Function to format page title from path
  const getPageTitle = () => {
    const path = location.pathname;
    
    // Define title mappings for specific paths
    const titleMap = {
      "/dashboard": "Dashboard",
      "/admin-dashboard": "Dashboard",
      "/orders": "Orders",
      "/admin-orders": "Orders",
      "/assignments": "Assignments", 
      "/admin-assignments": "Assignments",
      "/measurements": "Measurements",
      "/admin-measurements": "Measurements",
      "/admins": "Admins",
      "/customers": "Customers", 
      "/admin-customers": "Customers",
      "/payments": "Payments",
      "/admin-payments": "Payments",
      "/fabric-types": "Fabric Types",
      "/admin-fabric-types": "Fabric Types",
      "/garment-types": "Garment Types",
      "/admin-garment-types": "Garment Types",
      "/tailors": "Tailors",
      "/admin-tailors": "Tailors",
    };

    // Return mapped title or format the path
    return titleMap[path] || path
      .replace("/", "")
      .replace(/-/g, " ")
      .replace(/\b\w/g, l => l.toUpperCase()); // Capitalize first letter of each word
  };

  // Handle sidebar collapse state from child component
  const handleSidebarToggle = (collapsed) => {
    setIsSidebarCollapsed(collapsed);
  };

  // Handle mobile sidebar toggle
  const handleMobileSidebarToggle = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  // Close mobile sidebar when route changes
  React.useEffect(() => {
    setIsMobileSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar with collapse callback and mobile state */}
      <Sidebar 
        onToggle={handleSidebarToggle} 
        isMobileOpen={isMobileSidebarOpen}
        onMobileToggle={handleMobileSidebarToggle}
      />

      {/* Mobile Overlay - Only show on mobile when sidebar is open */}
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Main Area - Adjusts based on sidebar state */}
      <div className={`flex-1 flex flex-col transition-all duration-300 w-full ${
        isSidebarCollapsed ? "lg:ml-16" : "lg:ml-64"
      }`}>
        {/* Header with LogoutButton - Pass sidebar state and mobile toggle function */}
        <Header 
          title={getPageTitle()} 
          isSidebarCollapsed={isSidebarCollapsed}
          onMenuToggle={handleMobileSidebarToggle}
        >
          <LogoutButton />
        </Header>

        {/* Page Content - Responsive padding and margin */}
        <main className={`flex-1 p-3 sm:p-4 md:p-6 mt-12 sm:mt-8 transition-all duration-300 ${
          isMobileSidebarOpen ? "blur-sm lg:blur-0" : ""
        }`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;