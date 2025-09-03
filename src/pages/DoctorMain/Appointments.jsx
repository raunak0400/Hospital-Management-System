import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, ListGroup, Badge } from "react-bootstrap";

// ----------------- Mock Data -----------------
const mockDoctor = {
    id: "123",
    name: "John Doe",
    specialization: "Cardiology",
    email: "john.doe@example.com",
};

const mockAppointments = [
    { id: 1, patientName: "Alice Smith", time: "09:00 AM", status: "Confirmed" },
    { id: 2, patientName: "Bob Johnson", time: "10:30 AM", status: "Pending" },
    { id: 3, patientName: "Charlie Brown", time: "01:00 PM", status: "Completed" },
    { id: 1, patientName: "Alice Smith", time: "09:00 AM", status: "Confirmed" },
    { id: 2, patientName: "Bob Johnson", time: "10:30 AM", status: "Pending" },
    { id: 3, patientName: "Charlie Brown", time: "01:00 PM", status: "Completed" },
];

const mockStats = {
    appointments: 3,
    patients: 25,
    pendingReports: 2,
};
const mockPatients = [
    {
        id: "p1",
        firstName: "Alice",
        lastName: "Smith",
        dateOfBirth: "1990-05-12",
        gender: "female",
        phone: "1234567890",
        email: "alice@example.com",
        address: "123 Street, City",
        bloodType: "A+",
        emergencyContact: {
            name: "Bob Smith",
            relationship: "Spouse",
            phone: "0987654321"
        },
        medicalHistory: ["Diabetes", "Hypertension"],
        allergies: ["Penicillin", "Peanuts"],
        medications: ["Metformin", "Aspirin"],
        insurance: {
            provider: "HealthCare Inc.",
            policyNumber: "HC12345",
            groupNumber: "G123"
        },
        status: "active"
    },
    {
        id: "p2",
        firstName: "John",
        lastName: "Doe",
        dateOfBirth: "1985-08-20",
        gender: "male",
        phone: "9876543210",
        email: "john@example.com",
        address: "456 Avenue, City",
        bloodType: "B+",
        emergencyContact: {
            name: "Jane Doe",
            relationship: "Spouse",
            phone: "1234567890"
        },
        medicalHistory: ["Asthma"],
        allergies: ["None"],
        medications: ["Albuterol"],
        insurance: {
            provider: "HealthFirst",
            policyNumber: "HF67890",
            groupNumber: "G678"
        },
        status: "active"
    }
];


const mockNotifications = [
    { id: 1, message: "New lab report submitted for Alice Smith.", type: "info" },
    { id: 2, message: "Appointment canceled by Bob Johnson.", type: "warning" },
];

// ----------------- Dashboard Component -----------------
const DoctorDashboard = () => {
    const [doctor, setDoctor] = useState(null);
    const [appointments, setAppointments] = useState([]);
    const [stats, setStats] = useState({});
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        // Simulate API call
        const fetchData = async () => {
            setDoctor(mockDoctor);
            setAppointments(mockAppointments);
            setStats(mockStats);
            setNotifications(mockNotifications);
        };
        fetchData();
    }, []);

    // Function to get badge color based on status/type
    const getBadgeColor = (status) => {
        switch (status) {
            case "Confirmed":
            case "info":
                return "primary";
            case "Pending":
            case "warning":
                return "warning";
            case "Completed":
                return "success";
            default:
                return "secondary";
        }
    };

    return (
        <Container fluid className="mt-4">
            <h1 className="mb-4">Appointment List</h1>

            {/* Appointments List */}
            <Card className="mb-4">
                <Card.Header>Today's Appointments</Card.Header>
                <ListGroup variant="flush">
                    {appointments.length > 0 ? (
                        appointments.map((appt) => (
                            <ListGroup.Item key={appt.id} className="d-flex justify-content-between align-items-center">
                                <div>
                                    <strong>Patient:</strong> {appt.patientName} <br />
                                    <small>Time: {appt.time}</small>
                                </div>
                                <Badge bg={getBadgeColor(appt.status)}>{appt.status}</Badge>
                            </ListGroup.Item>
                        ))
                    ) : (
                        <ListGroup.Item>No appointments today</ListGroup.Item>
                    )}
                </ListGroup>
            </Card>

            



        </Container>
    );
};

export default DoctorDashboard;
