// ManageStaff.jsx
import React, { useState, useEffect } from "react";
import { Modal, Button, Table, Form, Badge } from "react-bootstrap";

// Mock Staff Data
const initialStaff = [
    { id: 1, name: "Dr. Rahul Sharma", role: "Doctor", email: "rahul@example.com", phone: "9876543210", department: "Cardiology", status: "Active" },
    { id: 2, name: "Nurse Anjali Mehta", role: "Nurse", email: "anjali@example.com", phone: "9876543211", department: "ICU", status: "Active" },
    { id: 3, name: "Receptionist Ravi Patel", role: "Receptionist", email: "ravi@example.com", phone: "9876543212", department: "Front Desk", status: "Inactive" },
    { id: 4, name: "Lab Tech Sneha Joshi", role: "Lab Technician", email: "sneha@example.com", phone: "9876543213", department: "Lab", status: "Active" },
    { id: 5, name: "Dr. Priya Singh", role: "Doctor", email: "priya@example.com", phone: "9876543214", department: "Neurology", status: "Active" },
];

const roles = ["Doctor", "Nurse", "Receptionist", "Lab Technician"];
const statusOptions = ["Active", "Inactive"];

const ManageStaff = () => {
    //   const [staffList, setStaffList] = useState(initialStaff);
    const [staffList, setStaffList] = useState(() => {
        // Load staff from localStorage if available, otherwise use mock data
        const storedStaff = localStorage.getItem("staffList");
        return storedStaff ? JSON.parse(storedStaff) : initialStaff;
    });

    const [showModal, setShowModal] = useState(false);
    const [editingStaff, setEditingStaff] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [formData, setFormData] = useState({
        name: "",
        role: "Doctor",
        email: "",
        phone: "",
        department: "",
        status: "Active",
    });

    // Open modal for add or edit
    const handleShowModal = (staff = null) => {
        setEditingStaff(staff);
        if (staff) {
            setFormData(staff);
        } else {
            setFormData({ name: "", role: "Doctor", email: "", phone: "", department: "", status: "Active" });
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingStaff(null);
    };

    // Handle form input
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Add or Update Staff
    const handleSave = () => {
        if (editingStaff) {
            // Update staff
            setStaffList(staffList.map(s => (s.id === editingStaff.id ? { ...formData, id: editingStaff.id } : s)));
        } else {
            // Add new staff
            const newStaff = { ...formData, id: Date.now() };
            setStaffList([...staffList, newStaff]);
        }
        handleCloseModal();
    };

    // Delete staff
    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this staff member?")) {
            setStaffList(staffList.filter(s => s.id !== id));
        }
    };

    // Filter staff based on search
    const filteredStaff = staffList.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.role.toLowerCase().includes(searchTerm.toLowerCase())
    );


    useEffect(() => {
        localStorage.setItem("staffList", JSON.stringify(staffList));
    }, [staffList]);
    return (
        <div className="container mt-4">
            <h2 className="mb-4">Manage Staff</h2>

            <div className="d-flex justify-content-between align-items-center mb-3">
                <Form.Control
                    type="text"
                    placeholder="Search staff by name, email or role..."
                    style={{ width: "300px" }}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button onClick={() => handleShowModal()} variant="primary">Add Staff</Button>
            </div>

            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>Profile</th>
                        <th>Name</th>
                        <th>Role</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Department</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredStaff.length > 0 ? filteredStaff.map(s => (
                        <tr key={s.id}>
                            <td>
                                <div className="avatar-circle">
                                    {s.name.split(" ").map(n => n[0]).join("").toUpperCase()}
                                </div>
                            </td>
                            <td>{s.name}</td>
                            <td>{s.role}</td>
                            <td>{s.email}</td>
                            <td>{s.phone}</td>
                            <td>{s.department}</td>
                            <td>
                                <Badge bg={s.status === "Active" ? "success" : "secondary"}>{s.status}</Badge>
                            </td>
                            <td>
                                <Button variant="warning" size="sm" onClick={() => handleShowModal(s)} className="me-2">Edit</Button>
                                <Button variant="danger" size="sm" onClick={() => handleDelete(s.id)}>Delete</Button>
                            </td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan="8" className="text-center">No staff found.</td>
                        </tr>
                    )}
                </tbody>
            </Table>

            {/* Modal for Add/Edit */}
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>{editingStaff ? "Edit Staff" : "Add Staff"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-2">
                            <Form.Label>Name</Form.Label>
                            <Form.Control name="name" value={formData.name} onChange={handleChange} />
                        </Form.Group>

                        <Form.Group className="mb-2">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} />
                        </Form.Group>

                        <Form.Group className="mb-2">
                            <Form.Label>Phone</Form.Label>
                            <Form.Control name="phone" value={formData.phone} onChange={handleChange} />
                        </Form.Group>

                        <Form.Group className="mb-2">
                            <Form.Label>Role</Form.Label>
                            <Form.Select name="role" value={formData.role} onChange={handleChange}>
                                {roles.map(r => <option key={r}>{r}</option>)}
                            </Form.Select>
                        </Form.Group>

                        <Form.Group className="mb-2">
                            <Form.Label>Department</Form.Label>
                            <Form.Control name="department" value={formData.department} onChange={handleChange} />
                        </Form.Group>

                        <Form.Group className="mb-2">
                            <Form.Label>Status</Form.Label>
                            <Form.Select name="status" value={formData.status} onChange={handleChange}>
                                {statusOptions.map(s => <option key={s}>{s}</option>)}
                            </Form.Select>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>Cancel</Button>
                    <Button variant="primary" onClick={handleSave}>{editingStaff ? "Update" : "Save"}</Button>
                </Modal.Footer>
            </Modal>

            {/* Simple Avatar CSS */}
            <style>{`
        .avatar-circle {
          width: 35px;
          height: 35px;
          background-color: #0d6efd;
          color: #fff;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          font-weight: bold;
          text-transform: uppercase;
        }
      `}</style>
        </div>
    );
};

export default ManageStaff;
