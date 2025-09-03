import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, ListGroup, Badge } from "react-bootstrap";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

// ---- Mock Data ----
const mockStats = {
  totalAppointments: 15,
  upcomingAppointments: 2,
  completedVisits: 10,
  pendingReports: 2,
  outstandingBills: 3,
};

const mockExpenses = [
  { name: "Consultations", value: 400 },
  { name: "Lab Tests", value: 250 },
  { name: "Medications", value: 180 },
  { name: "Other", value: 100 },
];

const mockAppointmentsPerMonth = [
  { month: "Jan", count: 2 },
  { month: "Feb", count: 1 },
  { month: "Mar", count: 3 },
  { month: "Apr", count: 0 },
  { month: "May", count: 2 },
  { month: "Jun", count: 1 },
  { month: "Jul", count: 2 },
  { month: "Aug", count: 1 },
  { month: "Sep", count: 3 },
];

const mockRecentActivity = [
  { id: 1, type: "appointment", message: "New appointment scheduled with Dr. John Doe on Sep 3, 2025" },
  { id: 2, type: "report", message: "New lab report available: Cholesterol Test" },
  { id: 3, type: "payment", message: "Payment of $120 processed successfully" },
];

// Colors for Pie Chart
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

// ---- Dashboard ----
const PatientDashboard = () => {
  const [stats, setStats] = useState({});
  const [expenses, setExpenses] = useState([]);
  const [appointmentsPerMonth, setAppointmentsPerMonth] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    // Load mock data
    setStats(mockStats);
    setExpenses(mockExpenses);
    setAppointmentsPerMonth(mockAppointmentsPerMonth);
    setRecentActivity(mockRecentActivity);
  }, []);

  return (
    <Container fluid className="mt-4">
      <h1 className="mb-4">Patient Dashboard</h1>

      {/* Quick Stats */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="text-center shadow-sm">
            <Card.Body>
              <Card.Title>Total Appointments</Card.Title>
              <h2>{stats.totalAppointments}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center shadow-sm">
            <Card.Body>
              <Card.Title>Upcoming</Card.Title>
              <h2>{stats.upcomingAppointments}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center shadow-sm">
            <Card.Body>
              <Card.Title>Pending Reports</Card.Title>
              <h2>{stats.pendingReports}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center shadow-sm">
            <Card.Body>
              <Card.Title>Outstanding Bills</Card.Title>
              <h2>{stats.outstandingBills}</h2>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Charts Section */}
      <Row className="mb-4">
        <Col md={6}>
          <Card className="shadow-sm">
            <Card.Header>Healthcare Expenses Breakdown</Card.Header>
            <Card.Body>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={expenses}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    label
                  >
                    {expenses.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="shadow-sm">
            <Card.Header>Appointments Per Month</Card.Header>
            <Card.Body>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={appointmentsPerMonth}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Recent Activity */}
      <Row>
        <Col md={12}>
          <Card className="shadow-sm">
            <Card.Header>Recent Activity</Card.Header>
            <ListGroup variant="flush">
              {recentActivity.map((activity) => (
                <ListGroup.Item key={activity.id}>
                  <Badge bg={
                    activity.type === "appointment" ? "info" :
                    activity.type === "report" ? "success" : "primary"
                  } className="me-2">
                    {activity.type.toUpperCase()}
                  </Badge>
                  {activity.message}
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default PatientDashboard;
