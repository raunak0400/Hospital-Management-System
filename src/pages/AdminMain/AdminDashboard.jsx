import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Table, Button, Badge, Form } from "react-bootstrap";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

// Mock data
const mockDoctors = [
  { id: 1, name: "Dr. John Doe", specialization: "Cardiology", email: "john.doe@example.com" },
  { id: 2, name: "Dr. Alice Smith", specialization: "Neurology", email: "alice.smith@example.com" },
  { id: 3, name: "Dr. Robert Brown", specialization: "Pediatrics", email: "robert.brown@example.com" },
];

const mockNurses = [
  { id: 1, name: "Nurse Mary Johnson", email: "mary.johnson@example.com" },
  { id: 2, name: "Nurse Michael Wilson", email: "michael.wilson@example.com" },
];

const mockPatients = [
  { id: 1, name: "Alice Smith", age: 25, gender: "Female", status: "Active" },
  { id: 2, name: "John Doe", age: 40, gender: "Male", status: "Critical" },
  { id: 3, name: "Mary Johnson", age: 32, gender: "Female", status: "Active" },
  { id: 4, name: "Robert Brown", age: 45, gender: "Male", status: "Inactive" },
  { id: 5, name: "Linda Davis", age: 29, gender: "Female", status: "Active" },
];

const mockTasks = [
  { id: 1, task: "Check patient vitals", assignedTo: "Nurse Mary Johnson", status: "Pending" },
  { id: 2, task: "Administer medication", assignedTo: "Nurse Michael Wilson", status: "Completed" },
  { id: 3, task: "Prepare lab reports", assignedTo: "Dr. John Doe", status: "Pending" },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const AdminDashboard = () => {
  const [doctors, setDoctors] = useState([]);
  const [nurses, setNurses] = useState([]);
  const [patients, setPatients] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setDoctors(mockDoctors);
    setNurses(mockNurses);
    setPatients(mockPatients);
    setTasks(mockTasks);
  }, []);

  const handleTaskStatusChange = (taskId) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId
          ? { ...task, status: task.status === "Pending" ? "Completed" : "Pending" }
          : task
      )
    );
  };

  // Chart Data
  const patientStatusData = [
    { name: "Active", value: patients.filter((p) => p.status === "Active").length },
    { name: "Inactive", value: patients.filter((p) => p.status === "Inactive").length },
    { name: "Critical", value: patients.filter((p) => p.status === "Critical").length },
  ];

  const staffData = [
    { name: "Doctors", count: doctors.length },
    { name: "Nurses", count: nurses.length },
  ];

  // Filter logic
  const filteredDoctors = doctors.filter((doc) =>
    doc.name.toLowerCase().includes(search.toLowerCase())
  );
  const filteredNurses = nurses.filter((nurse) =>
    nurse.name.toLowerCase().includes(search.toLowerCase())
  );
  const filteredPatients = patients.filter((pat) =>
    pat.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Container fluid className="mt-4">
      <h1 className="mb-4">Admin Dashboard</h1>

      {/* Overview Cards */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="text-center shadow-sm">
            <Card.Body>
              <Card.Title>Total Doctors</Card.Title>
              <Card.Text>{doctors.length}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center shadow-sm">
            <Card.Body>
              <Card.Title>Total Nurses</Card.Title>
              <Card.Text>{nurses.length}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center shadow-sm">
            <Card.Body>
              <Card.Title>Total Patients</Card.Title>
              <Card.Text>{patients.length}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center shadow-sm">
            <Card.Body>
              <Card.Title>Tasks Completed</Card.Title>
              <Card.Text>{tasks.filter((t) => t.status === "Completed").length}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Charts */}
      <Row className="mb-4">
        <Col md={6}>
          <Card>
            <Card.Header>Patient Status Distribution</Card.Header>
            <Card.Body style={{ height: "300px" }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={patientStatusData}
                    dataKey="value"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {patientStatusData.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card>
            <Card.Header>Staff Distribution</Card.Header>
            <Card.Body style={{ height: "300px" }}>
              <ResponsiveContainer>
                <BarChart data={staffData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Search */}
      <Row className="mb-3">
        <Col md={4}>
          <Form.Control
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </Col>
      </Row>

      {/* Doctors Table */}
      <Card className="mb-4">
        <Card.Header>Doctors</Card.Header>
        <Card.Body>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Specialization</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {filteredDoctors.map((doc) => (
                <tr key={doc.id}>
                  <td>{doc.id}</td>
                  <td>{doc.name}</td>
                  <td>{doc.specialization}</td>
                  <td>{doc.email}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Nurses Table */}
      <Card className="mb-4">
        <Card.Header>Nurses</Card.Header>
        <Card.Body>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
              </tr>
            </thead>
            <tbody>
              {filteredNurses.map((nurse) => (
                <tr key={nurse.id}>
                  <td>{nurse.id}</td>
                  <td>{nurse.name}</td>
                  <td>{nurse.email}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Patients Table */}
      <Card className="mb-4">
        <Card.Header>Patients</Card.Header>
        <Card.Body>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Age</th>
                <th>Gender</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.map((patient) => (
                <tr key={patient.id}>
                  <td>{patient.id}</td>
                  <td>{patient.name}</td>
                  <td>{patient.age}</td>
                  <td>{patient.gender}</td>
                  <td>
                    <Badge
                      bg={
                        patient.status === "Active"
                          ? "success"
                          : patient.status === "Inactive"
                          ? "secondary"
                          : "danger"
                      }
                    >
                      {patient.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Tasks Table */}
      <Card className="mb-4">
        <Card.Header>Tasks</Card.Header>
        <Card.Body>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>Task</th>
                <th>Assigned To</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task.id}>
                  <td>{task.id}</td>
                  <td>{task.task}</td>
                  <td>{task.assignedTo}</td>
                  <td>
                    <Badge bg={task.status === "Pending" ? "warning" : "success"}>
                      {task.status}
                    </Badge>
                  </td>
                  <td>
                    <Button size="sm" onClick={() => handleTaskStatusChange(task.id)}>
                      {task.status === "Pending" ? "Mark Completed" : "Mark Pending"}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AdminDashboard;
