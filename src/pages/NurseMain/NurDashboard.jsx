import React, { useState, useEffect } from "react";
import { Card, ListGroup, Row, Col, Button } from "react-bootstrap";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

// ✅ Mock Data
const mockTasks = [
  { id: 1, task: "Check vitals for Alice Smith", status: "Pending" },
  { id: 2, task: "Administer medication to John Doe", status: "Completed" },
  { id: 3, task: "Change IV line for Robert Brown", status: "Pending" },
  { id: 4, task: "Monitor oxygen for Michael Wilson", status: "Completed" },
  { id: 5, task: "Prepare discharge papers for Linda Davis", status: "Pending" },
];

const mockPatientsByStatus = [
  { name: "Stable", value: 6 },
  { name: "Critical", value: 3 },
  { name: "Observation", value: 2 },
];

const mockNotifications = [
  { id: 1, message: "Patient in room 102 has low oxygen saturation!" },
  { id: 2, message: "Lab sample for Alice Smith is ready." },
  { id: 3, message: "Shift handover scheduled at 3 PM." },
];

const COLORS = ["#4CAF50", "#FF5722", "#FFC107"];

const NurseDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    setTasks(mockTasks);
    setNotifications(mockNotifications);
  }, []);

  const handleCompleteTask = (taskId) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId ? { ...t, status: "Completed" } : t
      )
    );
  };

  // ✅ Chart Data
  const taskStats = [
    {
      name: "Tasks",
      Completed: tasks.filter((t) => t.status === "Completed").length,
      Pending: tasks.filter((t) => t.status === "Pending").length,
    },
  ];

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Nurse Dashboard</h1>

      <Row>
        {/* ✅ Task Completion Chart */}
        <Col md={6}>
          <Card className="mb-4 shadow">
            <Card.Header>Task Completion Overview</Card.Header>
            <Card.Body style={{ height: "300px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={taskStats}>
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Completed" fill="#4CAF50" />
                  <Bar dataKey="Pending" fill="#FF5722" />
                </BarChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>

        {/* ✅ Patients by Condition Pie Chart */}
        <Col md={6}>
          <Card className="mb-4 shadow">
            <Card.Header>Patients by Condition</Card.Header>
            <Card.Body style={{ height: "300px" }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={mockPatientsByStatus}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="value"
                    label
                  >
                    {mockPatientsByStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        {/* ✅ Task List */}
        <Col md={6}>
          <Card className="mb-4 shadow">
            <Card.Header>My Tasks</Card.Header>
            <ListGroup variant="flush">
              {tasks.map((t) => (
                <ListGroup.Item
                  key={t.id}
                  className="d-flex justify-content-between align-items-center"
                >
                  {t.task} - <em>{t.status}</em>
                  {t.status !== "Completed" && (
                    <Button
                      size="sm"
                      variant="success"
                      onClick={() => handleCompleteTask(t.id)}
                    >
                      Complete
                    </Button>
                  )}
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card>
        </Col>

        {/* ✅ Notifications */}
        <Col md={6}>
          <Card className="mb-4 shadow">
            <Card.Header>Notifications</Card.Header>
            <ListGroup variant="flush">
              {notifications.map((n) => (
                <ListGroup.Item key={n.id}>{n.message}</ListGroup.Item>
              ))}
            </ListGroup>
          </Card>
        </Col>
      </Row>

      {/* ✅ Quick Shift Summary */}
      <Card className="mb-4 shadow">
        <Card.Header>Shift Summary</Card.Header>
        <Card.Body>
          <p><strong>Total Tasks:</strong> {tasks.length}</p>
          <p><strong>Completed:</strong> {tasks.filter((t) => t.status === "Completed").length}</p>
          <p><strong>Pending:</strong> {tasks.filter((t) => t.status === "Pending").length}</p>
        </Card.Body>
      </Card>
    </div>
  );
};

export default NurseDashboard;
