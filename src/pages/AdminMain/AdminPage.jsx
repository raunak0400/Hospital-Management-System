import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  UserGroupIcon,
  PlusCircleIcon,
  ChartBarIcon,
  UserIcon,
  CalendarIcon,
  PhoneIcon,
  MenuIcon ,
  MailIcon
} from '@heroicons/react/outline';
import { analyticsAPI, patientAPI } from '../../services/api';
import Loader from '../../components/Loader';
import toast from 'react-hot-toast';
import Layout from '../../components/Layout';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import AdminDashboard from './AdminDashboard';

const AdminPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  useEffect(() => {
    fetchDashboardData();
  }, []); //jyare jyare usestate update thase tyare aa fetch varo function call thase
  const [recentPatients, setRecentPatients] = useState([]);

  const fetchDashboardData = async () => {
    const patientsResponse = await patientAPI.getPatients({ page: 1, limit: 5 });
    setRecentPatients(patientsResponse.data.patients);

  }



  function getAge(birthDate) {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  }

  const QuickAction = ({ title, description, icon: Icon, href, color }) => (
    <Link
      to={href}
      className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200"
    >
      <div className="flex items-center">
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div className="ml-4">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
    </Link>
  );


  return (
  

<div className="h-screen flex overflow-hidden bg-gray-100">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        {/* Top bar with mobile menu button */}
        <div className="lg:hidden">
          <div className="flex items-center justify-between h-16 px-4 bg-white border-b border-gray-200">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              <MenuIcon className="h-6 w-6" />
            </button>
            <h1 className="text-lg font-semibold text-gray-900">
              Healthcare Management
            </h1>
            <div className="w-6"></div> {/* Spacer for centering */}
          </div>
        </div>

        {/* Navbar (hidden on mobile) */}
        <div className="hidden lg:block">
          <Navbar />
        </div>

        {/* Main content area */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* {children}//its come from layout */} 
              <AdminDashboard/>
            </div>
          </div>
        </main>
        
      </div>
    </div>   



      
  
  );
};

export default AdminPage;