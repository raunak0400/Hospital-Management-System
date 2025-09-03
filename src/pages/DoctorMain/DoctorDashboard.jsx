import React, { useEffect, useMemo, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  ListGroup,
  Badge,
  Button,
  Accordion,
  Form,
} from "react-bootstrap";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { PersonFill, CalendarCheckFill, FileTextFill } from "react-bootstrap-icons";

// ----------------- Mock Data -----------------
const mockDoctor = {
  id: "123",
  name: "John Doe",
  specialization: "Cardiology",
  email: "john.doe@example.com",
};

// compact appointments (dashboard shows a short summary only)
const mockAppointments = [
  { id: 1, patientName: "Alice Smith", time: "09:00 AM", status: "Confirmed" },
  { id: 2, patientName: "Bob Johnson", time: "09:30 AM", status: "Pending" },
  { id: 3, patientName: "Michael Brown", time: "10:00 AM", status: "Completed" },
  { id: 4, patientName: "Emma Wilson", time: "10:30 AM", status: "Confirmed" },
  { id: 5, patientName: "David Lee", time: "11:00 AM", status: "Pending" },
  { id: 6, patientName: "Sophia Taylor", time: "11:30 AM", status: "Confirmed" },
  { id: 7, patientName: "James Anderson", time: "01:00 PM", status: "Completed" },
  { id: 8, patientName: "Olivia Martinez", time: "01:30 PM", status: "Confirmed" },
  { id: 9, patientName: "William Clark", time: "02:00 PM", status: "Pending" },
  { id: 10, patientName: "Isabella Lewis", time: "02:30 PM", status: "Confirmed" },
];

// Patients (we will not repeat full profiles — just quick cards and a critical list)
const mockPatients = [
  { id: "p1", name: "Alice Smith", age: 35, gender: "F", bloodType: "A+", status: "active" },
  { id: "p2", name: "John Doe", age: 40, gender: "M", bloodType: "B+", status: "active" },
  { id: "p3", name: "Michael Brown", age: 47, gender: "M", bloodType: "O-", status: "critical" },
  { id: "p4", name: "Emma Wilson", age: 30, gender: "F", bloodType: "AB+", status: "active" },
  { id: "p5", name: "David Lee", age: 36, gender: "M", bloodType: "B-", status: "active" },
  { id: "p6", name: "Sophia Taylor", age: 33, gender: "F", bloodType: "O+", status: "active" },
  { id: "p7", name: "James Anderson", age: 45, gender: "M", bloodType: "A-", status: "critical" },
  { id: "p8", name: "Olivia Martinez", age: 27, gender: "F", bloodType: "AB-", status: "active" },
  { id: "p9", name: "William Clark", age: 50, gender: "M", bloodType: "B+", status: "inactive" },
  { id: "p10", name: "Isabella Lewis", age: 31, gender: "F", bloodType: "A+", status: "active" },
];

const mockNotifications = [
  { id: 1, message: "New lab report submitted for Alice Smith.", type: "info" },
  { id: 2, message: "Appointment canceled by Bob Johnson.", type: "warning" },
  { id: 3, message: "Michael Brown's follow-up scheduled.", type: "info" },
  { id: 4, message: "Emma Wilson's lab results are ready.", type: "info" },
  { id: 5, message: "Pending report for David Lee.", type: "warning" },
];

const COLORS = ["#4CAF50", "#FF9800", "#F44336", "#2196F3"];

// ----------------- Helper -----------------
const badgeVariant = (status) => {
  if (status === "Confirmed" || status === "info") return "primary";
  if (status === "Pending" || status === "warning") return "warning";
  if (status === "Completed") return "success";
  return "secondary";
};

// ----------------- Dashboard Component -----------------
export default function DoctorDashboard() {
  const [doctor, setDoctor] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [patients] = useState(mockPatients);
  const [notifications, setNotifications] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  useEffect(() => {
    // load mock
    setDoctor(mockDoctor);
    setAppointments(mockAppointments);
    setNotifications(mockNotifications);
  }, []);

  // derived stats — memoized
  const stats = useMemo(() => {
    const todayAppointments = appointments.length;
    const totalPatients = patients.length;
    const pendingReports = appointments.filter((a) => a.status === "Pending").length;
    const criticalPatients = patients.filter((p) => p.status === "critical").length;
    return { todayAppointments, totalPatients, pendingReports, criticalPatients };
  }, [appointments, patients]);

  // appointment chart data
  const appointmentChartData = useMemo(() => {
    const statuses = ["Confirmed", "Pending", "Completed"];
    return statuses.map((s) => ({ status: s, count: appointments.filter((a) => a.status === s).length }));
  }, [appointments]);

  // patients by status for pie chart
  const patientsByStatus = useMemo(() => {
    const groups = {};
    patients.forEach((p) => (groups[p.status] = (groups[p.status] || 0) + 1));
    return Object.keys(groups).map((k, i) => ({ name: k, value: groups[k], color: COLORS[i % COLORS.length] }));
  }, [patients]);

  const filteredPatients = patients.filter((p) => {
    const nameMatch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const statusMatch = filterStatus ? p.status === filterStatus : true;
    return nameMatch && statusMatch;
  });

  const handleMarkNotification = (id) => setNotifications((prev) => prev.filter((n) => n.id !== id));

  // quick actions (mock) — example: generate summary or export
  const handleQuickAction = (action) => {
    if (action === "summary") {
      alert(`Daily summary:\nAppointments: ${stats.todayAppointments}\nPatients: ${stats.totalPatients}`);
    }
    if (action === "export") {
      // simple CSV export of today's appointments (mock)
      const csv = ["patientName,time,status", ...appointments.map(a => `${a.patientName},${a.time},${a.status}`)].join("\n");
      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `appointments_${new Date().toISOString().slice(0,10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <Container fluid className="mt-4">
      <Row className="mb-3 align-items-center">
        <Col>
          <h2>Doctor Dashboard</h2>
          <p className="text-muted">Summary & quick insights — non-repetitive overview.</p>
        </Col>
        <Col className="text-end">
          <Button variant="outline-primary" className="me-2" onClick={() => handleQuickAction("summary")}>Generate Summary</Button>
          <Button variant="outline-success" onClick={() => handleQuickAction("export")}>Export Appointments</Button>
        </Col>
      </Row>

      {/* top stats */}
      {doctor && (
        <Card className="mb-4 shadow-sm">
          <Card.Body className="d-flex flex-wrap justify-content-between align-items-center gap-3">
            <div>
              <h5 className="mb-0">Dr. {doctor.name}</h5>
              <small className="text-muted">{doctor.specialization} • {doctor.email}</small>
            </div>

            <div className="d-flex gap-3">
              <Card className="text-center p-3">
                <div className="text-primary"><CalendarCheckFill size={28} /></div>
                <div className="mt-2">Today's Appointments</div>
                <h3 className="mb-0">{stats.todayAppointments}</h3>
              </Card>

              <Card className="text-center p-3">
                <div className="text-success"><PersonFill size={28} /></div>
                <div className="mt-2">Total Patients</div>
                <h3 className="mb-0">{stats.totalPatients}</h3>
              </Card>

              <Card className="text-center p-3">
                <div className="text-warning"><FileTextFill size={28} /></div>
                <div className="mt-2">Pending Reports</div>
                <h3 className="mb-0">{stats.pendingReports}</h3>
              </Card>

              <Card className="text-center p-3">
                <div className="text-danger">⚠</div>
                <div className="mt-2">Critical Patients</div>
                <h3 className="mb-0">{stats.criticalPatients}</h3>
              </Card>
            </div>
          </Card.Body>
        </Card>
      )}

      <Row>
        {/* Appointments mini list */}
        <Col lg={6} className="mb-4">
          <Card className="h-100 shadow-sm">
            <Card.Header>Next Appointments (Quick)</Card.Header>
            <ListGroup variant="flush">
              {appointments.slice(0, 6).map((appt) => (
                <ListGroup.Item key={appt.id} className="d-flex justify-content-between align-items-center">
                  <div>
                    <strong>{appt.patientName}</strong>
                    <div className="text-muted small">{appt.time}</div>
                  </div>
                  <Badge bg={badgeVariant(appt.status)}>{appt.status}</Badge>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card>
        </Col>

        {/* Charts */}
        <Col lg={6} className="mb-4">
          <Row>
            <Col md={12} className="mb-3">
              <Card className="h-100 shadow-sm p-3">
                <Card.Title>Appointments by Status</Card.Title>
                <div style={{ width: "100%", height: 220 }}>
                  <ResponsiveContainer>
                    <BarChart data={appointmentChartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="status" />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Bar dataKey="count" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </Col>

            <Col md={12}>
              <Card className="h-100 shadow-sm p-3">
                <Card.Title>Patients by Status</Card.Title>
                <div style={{ width: "100%", height: 200 }}>
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie data={patientsByStatus} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label>
                        {patientsByStatus.map((entry, idx) => (
                          <Cell key={`cell-${idx}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>

      {/* Recent patients cards (compact) */}
      <Card className="mb-4 shadow-sm">
        <Card.Header>Recent Patients (Compact)</Card.Header>
        <Card.Body>
          <Row xs={1} md={2} lg={3} className="g-3">
            {filteredPatients.slice(0, 6).map((p) => (
              <Col key={p.id}>
                <Card className="h-100">
                  <Card.Body>
                    <Card.Title>{p.name}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">{p.gender} • {p.bloodType}</Card.Subtitle>
                    <div className="mb-2 small text-muted">Age: {p.age}</div>

                    <div className="d-flex gap-2">
                      <Button size="sm" variant="outline-primary">Open</Button>
                      <Button size="sm" variant="outline-secondary">Notes</Button>
                      <Button size="sm" variant="outline-danger">Flag</Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Card.Body>
      </Card>

      {/* Notifications */}
      <Card className="mb-4 shadow-sm">
        <Card.Header>Notifications</Card.Header>
        <ListGroup variant="flush">
          {notifications.length > 0 ? (
            notifications.map((note) => (
              <ListGroup.Item key={note.id} className="d-flex justify-content-between align-items-center">
                <div>
                  <Badge bg={badgeVariant(note.type)} className="me-2">{note.type.toUpperCase()}</Badge>
                  {note.message}
                </div>
                <Button size="sm" variant="outline-secondary" onClick={() => handleMarkNotification(note.id)}>Mark as read</Button>
              </ListGroup.Item>
            ))
          ) : (
            <ListGroup.Item>No new notifications</ListGroup.Item>
          )}
        </ListGroup>
      </Card>

    </Container>
  );
}
