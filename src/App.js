import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './utils/auth';
// import 'bootstrap/dist/css/bootstrap.min.css';
// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from "./pages/Register";
// import Dashboard from './pages/Dashboard';
import DashboardWrapper from "./pages/Dashboard/DashboardWrapper";
//role base pages
import AdminPage from "./pages/AdminMain/AdminPage";
import DoctorPage from "./pages/DoctorMain/DoctorPage";
import NursePage from "./pages/NurseMain/NursePage";
import PatientPage from "./pages/PatientMain/PatientPage";
import ReceptionistPage from "./pages/Receptionist/ReceptionistPage";
import PagesWrapper from "./pages/PagesWrapper";
//relebase dashboard
import DoctorDashboard from "./pages/DoctorMain/DoctorDashboard";
import NurseDashboard from "./pages/NurseMain/NurDashboard";
import PatientDashboard from "./pages/PatientMain/PatientDashboard";
import ReceptionistDashboard from "./pages/Receptionist/ReceptionistDashboard";
import AdminDashboard from "./pages/AdminMain/AdminDashboard";
import Analytics from './pages/Analytics';
import Patients from './pages/Receptionist/Patients';
import AddPatient from './pages/Receptionist/AddPatient';
import EditPatient from './pages/Receptionist/EditPatient';
import PatientDetail from './pages/PatientMain/PatientDetail';
import NotFound from './pages/NotFound';
import TestInput from './pages/TestInput';
import AddPatientStandalone from './pages/AddPatientStandalone';
import Appointments from './pages/DoctorMain/Appointments'
import Report from './pages/DoctorMain/Report';
import AddAppointment from './pages/Receptionist/AddAppointment';
//paitent related pages
import Patientappointments from './pages/PatientMain/Patientappointments';
import PaitentRepoort from './pages/PatientMain/PatientReport';
import PaitentProfile from './pages/PatientMain/PatientProfile';
import BillingPayment from './pages/PatientMain/BillingPayment';

import PaitentCare from './pages/NurseMain/PaitientCare'
// Protected Route wrapper
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import PatientCare from './pages/NurseMain/PaitientCare';
import ManageStaff from './pages/AdminMain/ManageStaff';
import Management from './pages/AdminMain/Management'

//1st try
// const App = () => { 

// const { user } = useAuth();
//   return (
//     <AuthProvider>
//       <Router>
//         <div className="App">
//           <Toaster
//             position="top-right"
//             toastOptions={{
//               duration: 4000,
//               style: {
//                 background: '#363636',
//                 color: '#fff',
//               },
//               success: {
//                 duration: 3000,
//                 iconTheme: {
//                   primary: '#10B981',
//                   secondary: '#fff',
//                 },
//               },
//               error: {
//                 duration: 4000,
//                 iconTheme: {
//                   primary: '#EF4444',
//                   secondary: '#fff',
//                 },
//               },
//             }}
//           />

//           <Routes>
//             {/* Public Routes */}
//             <Route path="/" element={<Home />} />
//             {/* <Route path="/dashboard" element={<DashboardWrapper />} /> */}
//             <Route path="/login" element={<Login />} />
//             <Route path="/register" element={<Register />} />
//             <Route path="/test-input" element={<TestInput />} />
//             <Route path="/add-patient-standalone" element={<AddPatientStandalone />} />

//             {/* Protected Routes with Layout */}
//             <Route
//               path="/PagesWrap"
//               element={
//                 <ProtectedRoute>
//                   {/* <Layout>
//                   <DashboardWrapper />
//                   </Layout> */}
//                   <PagesWrapper />
//                 </ProtectedRoute>
//               }
//             />

//             {/* my own added */}

//             {/* Admin dashboard */}
//             <Route
//               path="/admin"
//               element={
//                 user?.role === "admin" ? (
//                   <Layout>
//                     <AdminDashboard />
//                   </Layout>
//                 ) : (
//                   <Navigate to="/login" replace />
//                 )
//               }
//             />

//             {/* Doctor dashboard */}
//             <Route
//               path="/doctor"
//               element={
//                 user?.role === "doctor" ? (
//                   <Layout>
//                     <DoctorDashboard />
//                   </Layout>
//                 ) : (
//                   <Navigate to="/login" replace />
//                 )
//               }
//             />

//             {/* Patient dashboard */}
//             <Route
//               path="/patient"
//               element={
//                 user?.role === "patient" ? (
//                   <Layout>
//                     <PatientDashboard />
//                   </Layout>
//                 ) : (
//                   <Navigate to="/login" replace />
//                 )
//               }
//             />

//             {/* Nurse dashboard */}
//             <Route
//               path="/nurse"
//               element={
//                 user?.role === "nurse" ? (
//                   <Layout>
//                     <NurseDashboard />
//                   </Layout>
//                 ) : (
//                   <Navigate to="/login" replace />
//                 )
//               }
//             />

//             {/* Receptionist dashboard */}
//             <Route
//               path="/receptionist"
//               element={
//                 user?.role === "receptionist" ? (
//                   <Layout>
//                     <ReceptionistDashboard />
//                   </Layout>
//                 ) : (
//                   <Navigate to="/login" replace />
//                 )
//               }
//             />


//             {/* myown added end */}

//             <Route
//               path="/analytics"
//               element={
//                 <ProtectedRoute>
//                   <Layout>
//                     <Analytics />
//                   </Layout>
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/patients"
//               element={
//                 <ProtectedRoute>
//                   <Layout>
//                     <Patients />
//                   </Layout>
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/add-patient"
//               element={
//                 <ProtectedRoute>
//                   <Layout>
//                     <AddPatient />
//                   </Layout>
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/edit-patient/:id"
//               element={
//                 <ProtectedRoute>
//                   <Layout>
//                     <EditPatient />
//                   </Layout>
//                 </ProtectedRoute>
//               }
//             />
//             <Route
//               path="/patient/:id"
//               element={
//                 <ProtectedRoute>
//                   <Layout>
//                     <PatientDetail />
//                   </Layout>
//                 </ProtectedRoute>
//               }
//             />
//             {/* Not Found */}
//             <Route path="*" element={<NotFound />} />
//           </Routes>
//         </div>
//       </Router>
//     </AuthProvider>
//   );
// };

//2nd try now my registration is not happning


const App = () => {
  return (
    <AuthProvider>
      <Router>
        <AppContent />  {/* new component for routes */}
      </Router>
    </AuthProvider>
  );
};

const AppContent = () => {
  const { user } = useAuth();   // safe here!

  return (
    <div className="App">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10B981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#EF4444',
              secondary: '#fff',
            },
          },
        }}
      />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<DoctorDashboard />} />
        <Route path="/register" element={<Register />} />
        <Route path="/test-input" element={<TestInput />} />
        <Route path="/add-patient-standalone" element={<AddPatientStandalone />} />

        {/* Protected Routes with Layout */}
        <Route
          path="/PagesWrap"
          element={
            <ProtectedRoute>
              <PagesWrapper />
            </ProtectedRoute>
          }
        />



        {/* Admin dashboard */}
        
        <Route
          path="/admin"
          element={
            user?.role === "admin" ? (
              <Layout>
                <Management />
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />


        {/* Doctor dashboard */}
        <Route
          path="/doctor"
          element={
            user?.role === "doctor" ? (
              <Layout>
                <DoctorDashboard />
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Patient dashboard */}

        <Route
          path="/patient"
          element={
            user?.role === "patient" ? (
              <Layout>
                <PatientDashboard />
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Nurse dashboard */}
        <Route
          path="/nurse"
          element={
            user?.role === "nurse" ? (
              <Layout>
                <NurseDashboard />
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Receptionist dashboard */}
        <Route
          path="/receptionist"
          element={
            user?.role === "receptionist" ? (
              <Layout>
                <ReceptionistDashboard />
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/Doctordashboard"
          element={
            <ProtectedRoute>
              <Layout>
                <DoctorDashboard />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/Admindashboard"
          element={
            <ProtectedRoute>
              <Layout>
                <AdminDashboard />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/Nursedashboard"
          element={
            <ProtectedRoute>
              <Layout>
                <NurseDashboard />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/Receptionistdashboard"
          element={
            <ProtectedRoute>
              <Layout>
                <ReceptionistDashboard />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/Patientdashboard"
          element={
            <ProtectedRoute>
              <Layout>
                <PatientDashboard />
              </Layout>
            </ProtectedRoute>
          }
        />


        <Route
          path="/appointments"
          element={
            <ProtectedRoute>
              <Layout>
                <Appointments />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <Layout>
                <Report />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/addappointmentst"
          element={
            <ProtectedRoute>
              <Layout>
                <AddAppointment />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/Patientappointments"
          element={
            <ProtectedRoute>
              <Layout>
                <Patientappointments />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/Patientprofile"
          element={
            <ProtectedRoute>
              <Layout>
                <PaitentProfile />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/PaitentReport"
          element={
            <ProtectedRoute>
              <Layout>
                <PaitentRepoort />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/billingPayment"
          element={
            <ProtectedRoute>
              <Layout>
                <BillingPayment />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient-care"
          element={
            <ProtectedRoute>
              <Layout>
                <PatientCare />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/managestaff"
          element={
            <ProtectedRoute>
              <Layout>
                <ManageStaff />
              </Layout>
            </ProtectedRoute>
          }
        />    

         <Route
          path="/management"
          element={
            <ProtectedRoute>
              <Layout>
                <Management/>
              </Layout>
            </ProtectedRoute>
          }
        />  

        {/* myown end */}
        {/* Other protected routes */}
        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <Layout>
                <Analytics />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/patients"
          element={
            <ProtectedRoute>
              <Layout>
                <Patients />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-patient"
          element={
            <ProtectedRoute>
              <Layout>
                <AddPatient />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit-patient/:id"
          element={
            <ProtectedRoute>
              <Layout>
                <EditPatient />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/patient/:id"
          element={
            <ProtectedRoute>
              <Layout>
                <PatientDetail />
              </Layout>
            </ProtectedRoute>
          }
        />


        {/* Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

export default App;




