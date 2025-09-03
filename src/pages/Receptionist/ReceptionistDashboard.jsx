import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, ListGroup, Table, Badge, Form, ProgressBar } from "react-bootstrap";
import {
  CheckCircleFill,
  BellFill,
  PersonPlus,
  CalendarFill,
  HourglassSplit
} from "react-bootstrap-icons";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell
} from "recharts";

// ----- Mock Data -----
const mockPatients = [
  { id: 1, name: "Alice Smith", age: 30, gender: "Female" },
  { id: 2, name: "Bob Johnson", age: 45, gender: "Male" },
  { id: 3, name: "Charlie Brown", age: 28, gender: "Male" },
  { id: 4, name: "Diana Prince", age: 35, gender: "Female" },
  { id: 5, name: "Eve Adams", age: 22, gender: "Female" },
  { id: 6, name: "Frank Wright", age: 50, gender: "Male" },
  { id: 7, name: "Grace Lee", age: 40, gender: "Female" },
  { id: 8, name: "Henry Ford", age: 33, gender: "Male" },
  { id: 9, name: "Ivy Baker", age: 29, gender: "Female" },
  { id: 10, name: "Jack Black", age: 38, gender: "Male" },
];

const mockTasks = [
  { id: 1, task: "Call Alice Smith for appointment confirmation", completed: true },
  { id: 2, task: "Prepare new patient forms", completed: true },
  { id: 3, task: "Follow up with Dr. John Doe", completed: false },
  { id: 4, task: "Check lab results for Charlie Brown", completed: true },
  { id: 5, task: "Update insurance info for Diana Prince", completed: false },
  { id: 6, task: "Schedule appointment for Eve Adams", completed: true },
  { id: 7, task: "Verify documents for Frank Wright", completed: false },
  { id: 8, task: "Prepare monthly report", completed: false },
  { id: 9, task: "Confirm new registrations", completed: true },
  { id: 10, task: "Review patient feedback", completed: false },
];

const mockNotifications = [
  { id: 1, message: "Appointment canceled by Bob Johnson", type: "warning" },
  { id: 2, message: "New patient registered: Diana Prince", type: "info" },
  { id: 3, message: "Lab report ready for Charlie Brown", type: "danger" },
  { id: 4, message: "Reminder: Staff meeting at 3 PM", type: "info" },
  { id: 5, message: "Urgent: Update insurance forms", type: "warning" },
  { id: 6, message: "New patient: Eve Adams", type: "info" },
  { id: 7, message: "Appointment confirmed for Alice Smith", type: "info" },
  { id: 8, message: "Pending documents for Frank Wright", type: "warning" },
  { id: 9, message: "Lab results available for Grace Lee", type: "danger" },
  { id: 10, message: "Monthly report generated", type: "info" },
];

const mockStats = {
  checkedInToday: 6,
  appointmentsToday: 10,
  pendingAppointments: 4,
  newRegistrations: 7,
};

const appointmentsByDoctor = [
  { doctor: "Dr. John Doe", appointments: 5 },
  { doctor: "Dr. Jane Smith", appointments: 3 },
  { doctor: "Dr. Emily White", appointments: 2 },
  { doctor: "Dr. Michael Lee", appointments: 4 },
];

const patientGenderDistribution = [
  { gender: "Male", count: 6 },
  { gender: "Female", count: 4 },
];

const COLORS = ["#0088FE", "#FF8042"];

// ----- Dashboard Component -----
const ReceptionistDashboard = () => {
  const [patients, setPatients] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [stats, setStats] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setPatients(mockPatients);
    setTasks(mockTasks);
    setNotifications(mockNotifications);
    setStats(mockStats);
  }, []);

  const filteredPatients = patients.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // const taskProgress =
  //   tasks.length === 0 ? 0 : (tasks.filter((t) => t.completed).length / tasks.length) * 100;
  const toggleTask = (id) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  return (
    <Container fluid className="mt-4">
      <h1 className="mb-4">Receptionist Dashboard</h1>

      {/* Stats Cards */}
      <Row className="mb-4 g-3">
        <Col md={3}>
          <Card className="text-white bg-success shadow-sm border-0">
            <Card.Body className="d-flex align-items-center">
              <CheckCircleFill size={30} className="me-3" />
              <div>
                <Card.Title>Checked-in Today</Card.Title>
                <Card.Text className="fs-4">{stats.checkedInToday}</Card.Text>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-white bg-primary shadow-sm border-0">
            <Card.Body className="d-flex align-items-center">
              <CalendarFill size={30} className="me-3" />
              <div>
                <Card.Title>Appointments Today</Card.Title>
                <Card.Text className="fs-4">{stats.appointmentsToday}</Card.Text>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-white bg-warning shadow-sm border-0">
            <Card.Body className="d-flex align-items-center">
              <HourglassSplit size={30} className="me-3" />
              <div>
                <Card.Title>Pending Appointments</Card.Title>
                <Card.Text className="fs-4">{stats.pendingAppointments}</Card.Text>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-white bg-info shadow-sm border-0">
            <Card.Body className="d-flex align-items-center">
              <PersonPlus size={30} className="me-3" />
              <div>
                <Card.Title>New Registrations</Card.Title>
                <Card.Text className="fs-4">{stats.newRegistrations}</Card.Text>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Tasks & Notifications */}
      <Row className="mb-4 g-3">
       <Col md={6}>
          <Card className="shadow-sm">
            <Card.Header>Tasks</Card.Header>
            <ListGroup variant="flush">
              {tasks.map((task) => (
                <ListGroup.Item key={task.id}>
                  <Form.Check
                    type="checkbox"
                    label={task.task}
                    checked={task.completed} // ✅ shows checked if true
                    onChange={() => toggleTask(task.id)}
                  />
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="shadow-sm">
            <Card.Header>
              <BellFill className="me-2" /> Notifications
            </Card.Header>
            <ListGroup variant="flush">
              {notifications.map((note) => (
                <ListGroup.Item key={note.id}>
                  <Badge
                    bg={
                      note.type === "info"
                        ? "info"
                        : note.type === "warning"
                        ? "warning"
                        : "danger"
                    }
                    className="me-2"
                  >
                    {note.type.toUpperCase()}
                  </Badge>
                  {note.message}
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card>
        </Col>
      </Row>

      {/* Charts */}
      <Row className="mb-4 g-3">
        <Col md={6}>
          <Card className="shadow-sm">
            <Card.Header>Appointments per Doctor</Card.Header>
            <Card.Body>
              <BarChart width={500} height={300} data={appointmentsByDoctor}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="doctor" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="appointments" fill="#8884d8" />
              </BarChart>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="shadow-sm">
            <Card.Header>Patient Gender Distribution</Card.Header>
            <Card.Body>
              <PieChart width={400} height={300}>
                <Pie
                  data={patientGenderDistribution}
                  dataKey="count"
                  nameKey="gender"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {patientGenderDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Patient List */}
      <Row className="mb-4">
        <Col>
          <Card className="shadow-sm">
            <Card.Header>
              Patient List
              <Form.Control
                type="text"
                placeholder="Search patient..."
                className="mt-2"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Card.Header>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Age</th>
                  <th>Gender</th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.map((patient) => (
                  <tr key={patient.id}>
                    <td>{patient.id}</td>
                    <td>{patient.name}</td>
                    <td>{patient.age}</td>
                    <td>{patient.gender}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ReceptionistDashboard;
