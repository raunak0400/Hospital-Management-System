import React from 'react';
import Sidebar from './Sidebar'; // Ensure Sidebar.jsx exists
import Navbar from './Navbar';   // Ensure Navbar.jsx exists

const Layout = ({ children }) => {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-col flex-grow">
        <Navbar />
        <main className="p-4 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
