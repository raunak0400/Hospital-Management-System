

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../utils/auth';
import {
  HomeIcon,
  UserGroupIcon,
  PlusCircleIcon,
  ChartBarIcon,
  CogIcon,
  UsersIcon,
  ClipboardListIcon,
  CalendarIcon,
  XIcon,
} from '@heroicons/react/outline';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { user } = useAuth(); // user.role could be 'admin', 'doctor', 'nurse', 'patient'

  // ✅ Define navigation for each role
  const roleBasedNavigation = {
    admin: [
      { name: 'Management', href: '/management', icon: HomeIcon },
      { name: 'Patients', href: '/patients', icon: UserGroupIcon },
      { name: 'Manage Staff', href: '/managestaff', icon: UsersIcon },
      { name: 'Analytics', href: '/analytics', icon: ChartBarIcon },
      
    ],
    doctor: [
      { name: 'Dashboard', href: '/Doctordashboard', icon: HomeIcon },
      { name: 'Patients', href: '/patients', icon: UserGroupIcon },
      { name: 'Appointments', href: '/appointments', icon: CalendarIcon },
      { name: 'Reports', href: '/reports', icon: ClipboardListIcon },
    ],
    nurse: [
      { name: 'Dashboard', href: '/Nursedashboard', icon: HomeIcon },
      { name: 'Patient Care', href: '/patient-care', icon: UserGroupIcon },
      { name: 'Appointments', href: '/appointments', icon: CalendarIcon },
    ],
    patient: [
      { name: 'My Dashboard', href: '/Patientdashboard', icon: HomeIcon },
      { name: 'My Profile', href: '/Patientprofile', icon: UserGroupIcon },
      { name: 'Appointments', href: '/Patientappointments', icon: CalendarIcon },
      { name: 'Report', href: '/PaitentReport', icon: ClipboardListIcon },
      { name: 'Billing', href: '/billingPayment', icon: ChartBarIcon },
    ],
    receptionist: [
      { name: 'Dashboard', href: '/Receptionistdashboard', icon: HomeIcon },
      { name: 'Appointments', href: '/appointments', icon: CalendarIcon },
      { name: 'Add Patient', href: '/add-patient', icon: PlusCircleIcon },
      { name: 'Add Appointments', href: '/addappointmentst', icon: PlusCircleIcon },
    ],
  };

  // Pick navigation based on role, fallback to []
  const navigation = roleBasedNavigation[user?.role] || [];

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center justify-center h-16 px-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Healthcare System</h2>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {navigation.map((item) => {
          const current = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                current
                  ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
              onClick={onClose}
            >
              <item.icon className="mr-3 h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* User info */}
      <div className="px-4 py-4 border-t border-gray-200">
        <div className="text-xs text-gray-500">
          Logged in as: {user?.role || 'Guest'}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile sidebar overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Mobile sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Healthcare System</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
          >
            <XIcon className="h-6 w-6" />
          </button>
        </div>
        <SidebarContent />
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col h-0 flex-1 bg-white border-r border-gray-200">
            <SidebarContent />
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;

