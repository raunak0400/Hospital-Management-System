import { useAuth } from "../utils/auth";
import AdminPage from "./AdminMain/AdminPage";
import DoctorPage from "./DoctorMain/DoctorPage";
import NursePage from "./NurseMain/NursePage";
import PatientPage from "./PatientMain/PatientPage";
import ReceptionistPage from "./Receptionist/ReceptionistPage";

const PagesWrapper = () => {
  const { user } = useAuth();

  switch (user?.role) {
    case "admin":
      return <AdminPage />;
    case "doctor":
      return <DoctorPage/>;
    case "nurse":
      return <NursePage/>;
    case "patient":
      return <PatientPage/>;
    case "receptionist":
      return <ReceptionistPage/>;
    default:
      return <h2>No page found for your role.</h2>;
  }
};

export default PagesWrapper;
