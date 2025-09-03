import React, { useState, useEffect } from "react";
import { Card, Row, Col, Badge, ListGroup } from "react-bootstrap";
import { useParams } from "react-router-dom";

const PatientProfile = () => {
  // ✅ Mock Patients (replace with API later)
  const mockPatients = [
    {
      id: 1,
      name: "Rahul Sharma",
      age: 32,
      gender: "Male",
      phone: "9876543210",
      email: "rahul.sharma@example.com",
      address: "123 MG Road, Delhi",
      medicalHistory: ["Diabetes", "Hypertension"],
      allergies: ["Penicillin"],
      reports: ["Blood Test - Normal", "X-Ray - Clear"],
    },
    {
      id: 2,
      name: "Priya Verma",
      age: 28,
      gender: "Female",
      phone: "9876501234",
      email: "priya.verma@example.com",
      address: "45 Park Street, Mumbai",
      medicalHistory: ["Asthma"],
      allergies: ["Dust", "Peanuts"],
      reports: ["MRI Scan - Normal", "ECG - Stable"],
    },
    {
      id: 3,
      name: "Amit Patel",
      age: 45,
      gender: "Male",
      phone: "9876512345",
      email: "amit.patel@example.com",
      address: "78 Nehru Nagar, Ahmedabad",
      medicalHistory: ["Heart Disease"],
      allergies: [],
      reports: ["CT Scan - Pending"],
    },
  ];

  const { patientId } = useParams();
  const [patient, setPatient] = useState(null);

  useEffect(() => {
    // ✅ Default to first patient if no ID is provided
    const id = patientId ? parseInt(patientId, 10) : mockPatients[0].id;
    const selectedPatient = mockPatients.find((p) => p.id === id);
    setPatient(selectedPatient);
  }, [patientId]);

  if (!patient) return <p>⚠️ Patient not found.</p>;

  return (
    <div>
      <h2 className="mb-4">Patient Profile</h2>
      <Row>
        {/* Left Column - Basic Info */}
        <Col md={4}>
          <Card className="shadow-sm mb-3">
            <Card.Body>
              <h4>{patient.name}</h4>
              <p>
                <strong>Age:</strong> {patient.age}
              </p>
              <p>
                <strong>Gender:</strong> {patient.gender}
              </p>
              <p>
                <strong>Phone:</strong> {patient.phone}
              </p>
              <p>
                <strong>Email:</strong> {patient.email}
              </p>
              <p>
                <strong>Address:</strong> {patient.address}
              </p>
            </Card.Body>
          </Card>
        </Col>

        {/* Right Column - Medical Details */}
        <Col md={8}>
          <Row>
            <Col md={6}>
              <Card className="shadow-sm mb-3">
                <Card.Header>Medical History</Card.Header>
                <ListGroup variant="flush">
                  {patient.medicalHistory.length > 0 ? (
                    patient.medicalHistory.map((item, index) => (
                      <ListGroup.Item key={index}>{item}</ListGroup.Item>
                    ))
                  ) : (
                    <ListGroup.Item>No history available</ListGroup.Item>
                  )}
                </ListGroup>
              </Card>
            </Col>

            <Col md={6}>
              <Card className="shadow-sm mb-3">
                <Card.Header>Allergies</Card.Header>
                <ListGroup variant="flush">
                  {patient.allergies.length > 0 ? (
                    patient.allergies.map((item, index) => (
                      <ListGroup.Item key={index}>
                        <Badge bg="danger">{item}</Badge>
                      </ListGroup.Item>
                    ))
                  ) : (
                    <ListGroup.Item>No known allergies</ListGroup.Item>
                  )}
                </ListGroup>
              </Card>
            </Col>

            <Col md={12}>
              <Card className="shadow-sm">
                <Card.Header>Reports</Card.Header>
                <ListGroup variant="flush">
                  {patient.reports.length > 0 ? (
                    patient.reports.map((report, index) => (
                      <ListGroup.Item key={index}>{report}</ListGroup.Item>
                    ))
                  ) : (
                    <ListGroup.Item>No reports available</ListGroup.Item>
                  )}
                </ListGroup>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default PatientProfile;
