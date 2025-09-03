// import React, { useState } from 'react';
// import Navbar from './Navbar';
// import Sidebar from './Sidebar';
// import { MenuIcon } from '@heroicons/react/outline';

// const Layout = ({ children }) => {
//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   return (
//     <div className="h-screen flex overflow-hidden bg-gray-100">
//       {/* Sidebar */}
//       <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

//       {/* Main content */}
//       <div className="flex flex-col w-0 flex-1 overflow-hidden">
//         {/* Top bar with mobile menu button */}
//         <div className="lg:hidden">
//           <div className="flex items-center justify-between h-16 px-4 bg-white border-b border-gray-200">
//             <button
//               onClick={() => setSidebarOpen(true)}
//               className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
//             >
//               <MenuIcon className="h-6 w-6" />
//             </button>
//             <h1 className="text-lg font-semibold text-gray-900">
//               Healthcare Management
//             </h1>
//             <div className="w-6"></div> {/* Spacer for centering */}
//           </div>
//         </div>

//         {/* Navbar (hidden on mobile) */}
//         <div className="hidden lg:block">
//           <Navbar />
//         </div>

//         {/* Main content area */}
//         <main className="flex-1 relative overflow-y-auto focus:outline-none">
//           <div className="py-6">
//             <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//               {children}
//             </div>
//           </div>
//         </main>

//       </div>
//     </div>
//   );
// };

// export default Layout;
import React, { useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { MenuIcon } from '@heroicons/react/outline';
import { useAuth } from '../utils/auth';
import { Outlet } from "react-router-dom";

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth(); // user.role = 'admin' | 'doctor' | 'nurse' | 'patient' | 'receptionist'

  // ✅ Role-based top titles (you can customize per role)
  // const roleTitles = {
  //   admin: 'Admin Panel',
  //   doctor: 'Doctor Dashboard',
  //   nurse: 'Nurse Workspace',
  //   patient: 'My Health Portal',
  //   receptionist: 'Reception Desk',
  // };
  const roleTitles = {
    admin: 'AdminPage',
    doctor: 'DoctorPage',
    nurse: 'NursePage',
    patient: 'PatientPage',
    receptionist: 'ReceptionPage',
  };

  // Default to generic if role not matched
  const pageTitle = roleTitles[user?.role] || 'Healthcare Management';

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      {/* Sidebar - role aware */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
         {/* Outlet will render child pages here */}
        <Outlet />
        {/* Mobile Top bar */}
        <div className="lg:hidden">
          <div className="flex items-center justify-between h-16 px-4 bg-white border-b border-gray-200">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              <MenuIcon className="h-6 w-6" />
            </button>
            <h1 className="text-lg font-semibold text-gray-900">
              {pageTitle}
            </h1>
            <div className="w-6"></div>
          </div>
        </div>

        {/* Navbar (only for certain roles if you want) */}
        {/* {user?.role !== 'patient' && ( // Example: Patients don’t see Navbar
          <div className="hidden lg:block">
            <Navbar />
          </div>
        )} */}
      
          <div className="hidden lg:block">
            <Navbar />
          </div>
        

        {/* Main content area */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
