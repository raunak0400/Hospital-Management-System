import React, { useState, useEffect } from "react";
import { Card, Table } from "react-bootstrap";
import { useParams } from "react-router-dom";

const PatientAppointments = () => {
  // ✅ Mock Patients
  const mockPatients = [
    { id: 1, name: "Rahul Sharma", age: 32, gender: "Male" },
    { id: 2, name: "Priya Verma", age: 28, gender: "Female" },
    { id: 3, name: "Amit Patel", age: 45, gender: "Male" },
  ];

  // ✅ Mock Appointments
  const mockAppointments = [
    { id: 1, patientId: 1, doctor: "Dr. Singh", date: "2025-09-05", time: "10:00 AM", status: "Confirmed" },
    { id: 2, patientId: 1, doctor: "Dr. Patel", date: "2025-09-07", time: "2:00 PM", status: "Pending" },
    { id: 3, patientId: 2, doctor: "Dr. Khan", date: "2025-09-06", time: "11:30 AM", status: "Completed" },
    { id: 4, patientId: 3, doctor: "Dr. Mehta", date: "2025-09-08", time: "3:15 PM", status: "Cancelled" },
    { id: 5, patientId: 2, doctor: "Dr. Reddy", date: "2025-09-10", time: "9:45 AM", status: "Confirmed" },
  ];

  const { patientId } = useParams();

  // ✅ Default patient is the first one if none is selected
  const defaultPatientId = mockPatients[0].id;

  const [patient, setPatient] = useState(null);
  const [patientAppointments, setPatientAppointments] = useState([]);

  useEffect(() => {
    const id = patientId ? parseInt(patientId, 10) : defaultPatientId;

    const selectedPatient = mockPatients.find((p) => p.id === id);
    setPatient(selectedPatient);

    const filteredAppointments = mockAppointments.filter((a) => a.patientId === id);
    setPatientAppointments(filteredAppointments);
  }, [patientId]);

  // ✅ If still no patient found
  if (!patient) return <p>⚠️ Patient not found.</p>;

  return (
    <div>
      <h2 className="mb-3">Appointments for {patient.name}</h2>
      <Card className="shadow-sm">
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Date</th>
              <th>Time</th>
              <th>Doctor</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {patientAppointments.length > 0 ? (
              patientAppointments.map((a) => (
                <tr key={a.id}>
                  <td>{a.date}</td>
                  <td>{a.time}</td>
                  <td>{a.doctor}</td>
                  <td>
                    <span
                      className={`badge bg-${
                        a.status === "Confirmed"
                          ? "success"
                          : a.status === "Pending"
                          ? "warning"
                          : a.status === "Completed"
                          ? "primary"
                          : "danger"
                      }`}
                    >
                      {a.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center">
                  No appointments found
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </Card>
    </div>
  );
};

export default PatientAppointments;
