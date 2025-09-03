import React, { useState } from "react";
import { Card, ListGroup, ProgressBar, Button, Modal, Form } from "react-bootstrap";



// Mock Patients Data (10 patients)
const mockPatients = [
  {
    id: 1,
    name: "Rahul Sharma",
    vitals: { bp: "120/80 mmHg", hr: 78, spo2: 97, temp: "98.6°F" },
    medications: [
      { id: 1, name: "Paracetamol", time: "08:00 AM", status: "Given" },
      { id: 2, name: "Antibiotic", time: "02:00 PM", status: "Pending" },
    ],
    notes: ["Patient complained of mild headache."],
    painLevel: 4,
    upcomingTasks: [
      { id: 1, task: "Dressing change", time: "02:00 PM" },
      { id: 2, task: "Physiotherapy session", time: "04:30 PM" },
    ],
  },
  {
    id: 2,
    name: "Anita Desai",
    vitals: { bp: "110/70 mmHg", hr: 85, spo2: 95, temp: "99.1°F" },
    medications: [
      { id: 1, name: "Insulin", time: "09:00 AM", status: "Given" },
      { id: 2, name: "Painkiller", time: "03:00 PM", status: "Pending" },
    ],
    notes: ["Patient is diabetic. Monitoring sugar levels."],
    painLevel: 6,
    upcomingTasks: [{ id: 1, task: "Blood Sugar Test", time: "11:00 AM" }],
  },
  {
    id: 3,
    name: "Arjun Mehta",
    vitals: { bp: "130/85 mmHg", hr: 90, spo2: 93, temp: "100.2°F" },
    medications: [
      { id: 1, name: "Cough Syrup", time: "10:00 AM", status: "Given" },
      { id: 2, name: "Antibiotic", time: "06:00 PM", status: "Pending" },
    ],
    notes: ["Patient has chest congestion."],
    painLevel: 5,
    upcomingTasks: [{ id: 1, task: "Chest X-ray", time: "03:00 PM" }],
  },
  {
    id: 4,
    name: "Sneha Kapoor",
    vitals: { bp: "118/76 mmHg", hr: 72, spo2: 99, temp: "98.4°F" },
    medications: [{ id: 1, name: "Vitamin D", time: "09:00 AM", status: "Given" }],
    notes: ["Recovering from surgery."],
    painLevel: 3,
    upcomingTasks: [{ id: 1, task: "Suture removal", time: "05:00 PM" }],
  },
  {
    id: 5,
    name: "Ravi Iyer",
    vitals: { bp: "140/95 mmHg", hr: 95, spo2: 92, temp: "99.7°F" },
    medications: [
      { id: 1, name: "Blood Pressure Tablet", time: "07:00 AM", status: "Given" },
      { id: 2, name: "Cholesterol Medicine", time: "09:00 PM", status: "Pending" },
    ],
    notes: ["Patient has hypertension."],
    painLevel: 7,
    upcomingTasks: [{ id: 1, task: "ECG", time: "12:00 PM" }],
  },
  {
    id: 6,
    name: "Priya Nair",
    vitals: { bp: "115/75 mmHg", hr: 80, spo2: 98, temp: "98.9°F" },
    medications: [
      { id: 1, name: "Iron Supplement", time: "08:00 AM", status: "Given" },
      { id: 2, name: "Calcium Tablet", time: "08:00 PM", status: "Pending" },
    ],
    notes: ["Patient is anemic."],
    painLevel: 2,
    upcomingTasks: [{ id: 1, task: "Blood Test", time: "10:30 AM" }],
  },
  {
    id: 7,
    name: "Mohit Verma",
    vitals: { bp: "125/82 mmHg", hr: 88, spo2: 96, temp: "99.3°F" },
    medications: [
      { id: 1, name: "Antacid", time: "07:30 AM", status: "Given" },
      { id: 2, name: "Painkiller", time: "01:00 PM", status: "Pending" },
    ],
    notes: ["Complains of stomach pain."],
    painLevel: 5,
    upcomingTasks: [{ id: 1, task: "Ultrasound", time: "04:00 PM" }],
  },
  {
    id: 8,
    name: "Neha Singh",
    vitals: { bp: "122/78 mmHg", hr: 76, spo2: 97, temp: "98.7°F" },
    medications: [{ id: 1, name: "Vitamin B12", time: "09:00 AM", status: "Given" }],
    notes: ["Patient is stable and cheerful."],
    painLevel: 1,
    upcomingTasks: [{ id: 1, task: "Routine Checkup", time: "06:00 PM" }],
  },
  {
    id: 9,
    name: "Karan Malhotra",
    vitals: { bp: "135/88 mmHg", hr: 92, spo2: 94, temp: "100.5°F" },
    medications: [
      { id: 1, name: "Antibiotic", time: "08:00 AM", status: "Given" },
      { id: 2, name: "Paracetamol", time: "02:00 PM", status: "Pending" },
    ],
    notes: ["Patient has mild fever."],
    painLevel: 6,
    upcomingTasks: [{ id: 1, task: "Blood Culture", time: "11:00 AM" }],
  },
  {
    id: 10,
    name: "Pooja Reddy",
    vitals: { bp: "118/74 mmHg", hr: 70, spo2: 99, temp: "98.3°F" },
    medications: [{ id: 1, name: "Multivitamin", time: "08:00 AM", status: "Given" }],
    notes: ["Recovering well after flu."],
    painLevel: 2,
    upcomingTasks: [{ id: 1, task: "Final Checkup", time: "03:30 PM" }],
  },
];


const PatientCare = () => {
  const [selectedPatient, setSelectedPatient] = useState(mockPatients[0]);
  const [showNotes, setShowNotes] = useState(false);
  const [newNote, setNewNote] = useState("");

  // ✅ Add Note Handler
  const handleAddNote = () => {
    if (newNote.trim() !== "") {
      setSelectedPatient((prev) => ({
        ...prev,
        notes: [...prev.notes, newNote],
      }));
      setNewNote("");
      setShowNotes(false);
    }
  };

  return (
    <Card className="mb-4 shadow">
      <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
        Patient Care
        <Form.Select
          style={{ width: "200px" }}
          value={selectedPatient.id}
          onChange={(e) =>
            setSelectedPatient(
              mockPatients.find((p) => p.id === parseInt(e.target.value))
            )
          }
        >
          {mockPatients.map((patient) => (
            <option key={patient.id} value={patient.id}>
              {patient.name}
            </option>
          ))}
        </Form.Select>
      </Card.Header>

      <Card.Body>
        {/* Vitals */}
        <h5>Vital Signs</h5>
        <p>
          <strong>BP:</strong> {selectedPatient.vitals.bp} |{" "}
          <strong>HR:</strong> {selectedPatient.vitals.hr} bpm |{" "}
          <strong>SpO₂:</strong> {selectedPatient.vitals.spo2}% |{" "}
          <strong>Temp:</strong> {selectedPatient.vitals.temp}
        </p>
        <hr />

        {/* Medications */}
        <h5>Medication Schedule</h5>
        <ListGroup className="mb-3">
          {selectedPatient.medications.map((med) => (
            <ListGroup.Item key={med.id}>
              {med.name} - {med.time}{" "}
              {med.status === "Given" ? (
                <span className="text-success">✅ {med.status}</span>
              ) : (
                <span className="text-danger">⏳ {med.status}</span>
              )}
            </ListGroup.Item>
          ))}
        </ListGroup>
        <hr />

        {/* Notes */}
        <h5>Nursing Notes</h5>
        <Button
          size="sm"
          variant="outline-primary"
          onClick={() => setShowNotes(true)}
        >
          View / Add Notes
        </Button>
        <Modal show={showNotes} onHide={() => setShowNotes(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Nursing Notes - {selectedPatient.name}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <ul>
              {selectedPatient.notes.map((note, index) => (
                <li key={index}>{note}</li>
              ))}
            </ul>
            <Form.Control
              as="textarea"
              rows={2}
              placeholder="Write new note..."
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              className="mt-2"
            />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowNotes(false)}>
              Close
            </Button>
            <Button variant="primary" onClick={handleAddNote}>
              Add Note
            </Button>
          </Modal.Footer>
        </Modal>
        <hr />

        {/* Pain Scale */}
        <h5>Pain/Comfort Level</h5>
        <p>Current Pain Level: {selectedPatient.painLevel}/10</p>
        <ProgressBar
          now={selectedPatient.painLevel * 10}
          variant={selectedPatient.painLevel > 6 ? "danger" : "warning"}
          className="mb-3"
        />
        <hr />

        {/* Upcoming Care Tasks */}
        <h5>Upcoming Care Tasks</h5>
        <ListGroup>
          {selectedPatient.upcomingTasks.map((task) => (
            <ListGroup.Item key={task.id}>
              📝 {task.task} — <strong>{task.time}</strong>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Card.Body>
    </Card>
  );
};

export default PatientCare;
