import React from "react";

const Header = ({ title, children, isSidebarCollapsed, onMenuToggle }) => {
  return (
    <header 
      className={`fixed h-14 sm:h-16 bg-gray-900 text-white flex justify-between items-center px-4 sm:px-6 shadow-md z-40 transition-all duration-300 ${
        isSidebarCollapsed ? "lg:left-10" : "lg:left-64"
      } left-0 right-0 top-0`}
    >
      {/* Left Section - Menu Button (Mobile) */}
      <div className="flex items-center space-x-3 sm:space-x-4">
        {/* Mobile Menu Button - Only show on small screens */}
        {onMenuToggle && (
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 rounded-md hover:bg-gray-800 transition-colors duration-200"
            aria-label="Toggle menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        )}

      </div>

      {/* Right Section - Children (like LogoutButton) */}
      <div className="flex items-center space-x-2 sm:space-x-4">
        {React.Children.map(children, (child) =>
          React.isValidElement(child)
            ? React.cloneElement(child, {
                className: `${child.props.className || ''} text-sm sm:text-base`
              })
            : child
        )}
      </div>
    </header>
  );
};

export default Header;