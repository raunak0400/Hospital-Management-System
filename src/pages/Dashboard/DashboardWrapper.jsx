import { useAuth } from "../../utils/auth";
import AdminDashboard from "../AdminMain/AdminDashboard";
import DoctorDashboard from "../DoctorMain/DoctorDashboard";
import NurseDashboard from "../NurseMain/NurDashboard";
import PatientDashboard from "../PatientMain/PatientDashboard";
import ReceptionistDashboard from "../Receptionist/ReceptionistDashboard";

const DashboardWrapper = () => {
  const { user } = useAuth();

  switch (user?.role) {
    case "admin":
      return <AdminDashboard />;
    case "doctor":
      return <DoctorDashboard />;
    case "nurse":
      return <NurseDashboard />;
    case "patient":
      return <PatientDashboard />;
    case "receptionist":
      return <ReceptionistDashboard />;
    default:
      return <h2>No dashboard found for your role.</h2>;
  }
};

export default DashboardWrapper;
