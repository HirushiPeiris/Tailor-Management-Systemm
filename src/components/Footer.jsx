import React from 'react';

const COPYRIGHT_TEXT = "© 2025 Tailor Management System. All rights reserved.";

function Footer() {
  return (
    <footer className="w-full">
      <div className="bg-yellow-500 text-white py-4 text-center">
        <p className="text-sm font-medium">{COPYRIGHT_TEXT}</p>
      </div>
    </footer>
  );
}

export default Footer;
