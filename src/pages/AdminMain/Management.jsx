// HospitalManagement.jsx
import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Badge } from "react-bootstrap";

// ------------------ MOCK DATA ------------------
const initialDepartments = [
  { id: 1, name: "Cardiology" },
  { id: 2, name: "ICU" },
  { id: 3, name: "Lab" },
  { id: 4, name: "Neurology" },
  { id: 5, name: "Orthopedics" },
  { id: 6, name: "Radiology" },
  { id: 7, name: "Pediatrics" },
  { id: 8, name: "Oncology" },
  { id: 9, name: "Emergency" },
  { id: 10, name: "Dermatology" },
  { id: 11, name: "ENT" },
  { id: 12, name: "Gynecology" },
];

const initialRooms = [
  { id: 1, department: "ICU", roomNumber: "ICU-101", totalBeds: 2, occupiedBeds: 1 },
  { id: 2, department: "Cardiology", roomNumber: "C-201", totalBeds: 3, occupiedBeds: 2 },
  { id: 3, department: "Neurology", roomNumber: "N-301", totalBeds: 2, occupiedBeds: 1 },
  { id: 4, department: "Orthopedics", roomNumber: "O-101", totalBeds: 4, occupiedBeds: 3 },
  { id: 5, department: "Pediatrics", roomNumber: "P-201", totalBeds: 3, occupiedBeds: 1 },
  { id: 6, department: "Radiology", roomNumber: "R-101", totalBeds: 1, occupiedBeds: 0 },
  { id: 7, department: "Oncology", roomNumber: "ON-101", totalBeds: 2, occupiedBeds: 2 },
  { id: 8, department: "Emergency", roomNumber: "E-101", totalBeds: 5, occupiedBeds: 4 },
  { id: 9, department: "ENT", roomNumber: "ENT-101", totalBeds: 2, occupiedBeds: 1 },
  { id: 10, department: "Gynecology", roomNumber: "G-101", totalBeds: 3, occupiedBeds: 2 },
  { id: 11, department: "Dermatology", roomNumber: "D-101", totalBeds: 2, occupiedBeds: 0 },
];

const initialEquipment = [
  { id: 1, name: "ECG Machine", department: "Cardiology", quantity: 2 },
  { id: 2, name: "Ventilator", department: "ICU", quantity: 5 },
  { id: 3, name: "X-Ray Machine", department: "Radiology", quantity: 1 },
  { id: 4, name: "Ultrasound Machine", department: "Gynecology", quantity: 2 },
  { id: 5, name: "Defibrillator", department: "Emergency", quantity: 3 },
  { id: 6, name: "MRI Machine", department: "Neurology", quantity: 1 },
  { id: 7, name: "Infusion Pump", department: "ICU", quantity: 4 },
  { id: 8, name: "Surgical Table", department: "Orthopedics", quantity: 2 },
  { id: 9, name: "Stethoscope", department: "Pediatrics", quantity: 10 },
  { id: 10, name: "Lab Microscope", department: "Lab", quantity: 5 },
  { id: 11, name: "Oxygen Cylinder", department: "ICU", quantity: 8 },
  { id: 12, name: "Nebulizer", department: "ENT", quantity: 6 },
];

// ------------------ COMPONENT ------------------
const HospitalManagement = () => {
  // ------------------ STATES ------------------
  const [departments, setDepartments] = useState(() => {
    const stored = localStorage.getItem("departments");
    return stored ? JSON.parse(stored) : initialDepartments;
  });
  const [deptModal, setDeptModal] = useState(false);
  const [editingDept, setEditingDept] = useState(null);
  const [deptName, setDeptName] = useState("");

  const [rooms, setRooms] = useState(() => {
    const stored = localStorage.getItem("rooms");
    return stored ? JSON.parse(stored) : initialRooms;
  });
  const [roomModal, setRoomModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [roomData, setRoomData] = useState({ department: "", roomNumber: "", totalBeds: 1, occupiedBeds: 0 });

  const [equipment, setEquipment] = useState(() => {
    const stored = localStorage.getItem("equipment");
    return stored ? JSON.parse(stored) : initialEquipment;
  });
  const [equipModal, setEquipModal] = useState(false);
  const [editingEquip, setEditingEquip] = useState(null);
  const [equipData, setEquipData] = useState({ name: "", department: "", quantity: 1 });

  // ------------------ LOCALSTORAGE ------------------
  useEffect(() => { localStorage.setItem("departments", JSON.stringify(departments)); }, [departments]);
  useEffect(() => { localStorage.setItem("rooms", JSON.stringify(rooms)); }, [rooms]);
  useEffect(() => { localStorage.setItem("equipment", JSON.stringify(equipment)); }, [equipment]);

  // ------------------ DEPARTMENTS HANDLERS ------------------
  const openDeptModal = (dept = null) => {
    setEditingDept(dept);
    setDeptName(dept ? dept.name : "");
    setDeptModal(true);
  };
  const saveDept = () => {
    if (editingDept) {
      setDepartments(departments.map(d => d.id === editingDept.id ? { ...d, name: deptName } : d));
    } else {
      setDepartments([...departments, { id: Date.now(), name: deptName }]);
    }
    setDeptModal(false);
  };
  const deleteDept = (id) => { if(window.confirm("Delete this department?")) setDepartments(departments.filter(d => d.id !== id)); };

  // ------------------ ROOMS HANDLERS ------------------
  const openRoomModal = (room = null) => {
    setEditingRoom(room);
    setRoomData(room || { department: "", roomNumber: "", totalBeds: 1, occupiedBeds: 0 });
    setRoomModal(true);
  };
  const saveRoom = () => {
    if (editingRoom) {
      setRooms(rooms.map(r => r.id === editingRoom.id ? { ...roomData, id: editingRoom.id } : r));
    } else {
      setRooms([...rooms, { ...roomData, id: Date.now() }]);
    }
    setRoomModal(false);
  };
  const deleteRoom = (id) => { if(window.confirm("Delete this room?")) setRooms(rooms.filter(r => r.id !== id)); };

  // ------------------ EQUIPMENT HANDLERS ------------------
  const openEquipModal = (equip = null) => {
    setEditingEquip(equip);
    setEquipData(equip || { name: "", department: "", quantity: 1 });
    setEquipModal(true);
  };
  const saveEquip = () => {
    if (editingEquip) {
      setEquipment(equipment.map(e => e.id === editingEquip.id ? { ...equipData, id: editingEquip.id } : e));
    } else {
      setEquipment([...equipment, { ...equipData, id: Date.now() }]);
    }
    setEquipModal(false);
  };
  const deleteEquip = (id) => { if(window.confirm("Delete this equipment?")) setEquipment(equipment.filter(e => e.id !== id)); };

  // ------------------ RENDER ------------------
  return (
    <div className="container mt-4">
      <h2 className="mb-4">Hospital / Department Management</h2>

      {/* Departments Section */}
      <div className="mb-5">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h4>Departments & Wards</h4>
          <Button onClick={() => openDeptModal()} variant="primary">Add Department</Button>
        </div>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {departments.map(d => (
              <tr key={d.id}>
                <td>{d.name}</td>
                <td>
                  <Button variant="warning" size="sm" onClick={() => openDeptModal(d)} className="me-2">Edit</Button>
                  <Button variant="danger" size="sm" onClick={() => deleteDept(d.id)}>Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {/* Rooms Section */}
      <div className="mb-5">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h4>Room / Bed Management</h4>
          <Button onClick={() => openRoomModal()} variant="primary">Add Room</Button>
        </div>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Department</th>
              <th>Room Number</th>
              <th>Total Beds</th>
              <th>Occupied Beds</th>
              <th>Available Beds</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map(r => (
              <tr key={r.id}>
                <td>{r.department}</td>
                <td>{r.roomNumber}</td>
                <td>{r.totalBeds}</td>
                <td>{r.occupiedBeds}</td>
                <td>{r.totalBeds - r.occupiedBeds}</td>
                <td>
                  <Button variant="warning" size="sm" onClick={() => openRoomModal(r)} className="me-2">Edit</Button>
                  <Button variant="danger" size="sm" onClick={() => deleteRoom(r.id)}>Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {/* Equipment Section */}
      <div className="mb-5">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h4>Equipment Management</h4>
          <Button onClick={() => openEquipModal()} variant="primary">Add Equipment</Button>
        </div>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Name</th>
              <th>Department</th>
              <th>Quantity</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {equipment.map(e => (
              <tr key={e.id}>
                <td>{e.name}</td>
                <td>{e.department}</td>
                <td>{e.quantity}</td>
                <td>
                  <Button variant="warning" size="sm" onClick={() => openEquipModal(e)} className="me-2">Edit</Button>
                  <Button variant="danger" size="sm" onClick={() => deleteEquip(e.id)}>Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {/* Modals */}
      {/* Department Modal */}
      <Modal show={deptModal} onHide={() => setDeptModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editingDept ? "Edit Department" : "Add Department"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Name</Form.Label>
              <Form.Control value={deptName} onChange={e => setDeptName(e.target.value)} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setDeptModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={saveDept}>{editingDept ? "Update" : "Save"}</Button>
        </Modal.Footer>
      </Modal>

      {/* Room Modal */}
      <Modal show={roomModal} onHide={() => setRoomModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editingRoom ? "Edit Room" : "Add Room"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Department</Form.Label>
              <Form.Control value={roomData.department} onChange={e => setRoomData({...roomData, department: e.target.value})} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Room Number</Form.Label>
              <Form.Control value={roomData.roomNumber} onChange={e => setRoomData({...roomData, roomNumber: e.target.value})} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Total Beds</Form.Label>
              <Form.Control type="number" value={roomData.totalBeds} onChange={e => setRoomData({...roomData, totalBeds: parseInt(e.target.value)})} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Occupied Beds</Form.Label>
              <Form.Control type="number" value={roomData.occupiedBeds} onChange={e => setRoomData({...roomData, occupiedBeds: parseInt(e.target.value)})} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setRoomModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={saveRoom}>{editingRoom ? "Update" : "Save"}</Button>
        </Modal.Footer>
      </Modal>

      {/* Equipment Modal */}
      <Modal show={equipModal} onHide={() => setEquipModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editingEquip ? "Edit Equipment" : "Add Equipment"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Name</Form.Label>
              <Form.Control value={equipData.name} onChange={e => setEquipData({...equipData, name: e.target.value})} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Department</Form.Label>
              <Form.Control value={equipData.department} onChange={e => setEquipData({...equipData, department: e.target.value})} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Quantity</Form.Label>
              <Form.Control type="number" value={equipData.quantity} onChange={e => setEquipData({...equipData, quantity: parseInt(e.target.value)})} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setEquipModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={saveEquip}>{editingEquip ? "Update" : "Save"}</Button>
        </Modal.Footer>
      </Modal>

    </div>
  );
};

export default HospitalManagement;
