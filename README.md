# 🏥 Healthcare Patient Management System

![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)
![Contributions Welcome](https://img.shields.io/badge/Contributions-Welcome-brightgreen.svg)

A secure, full-stack hospital management web application designed to streamline patient record handling and role-based operations. Built with **Flask** (Python) for the backend and **React.js + Tailwind CSS + TypeScript** for the frontend, it supports multiple roles such as **Admin, Nurse, and Receptionist**, with secure **JWT authentication** and **MongoDB** integration.

---

## 🚀 Features

- 🔐 **JWT-based Authentication & Authorization**
  - Secure login system for Admin, Nurse, and Receptionist roles
  - Role-based access control (RBAC) for protected routes

- 🏥 **Patient Management (CRUD)**
  - Create, read, update, and delete patient records
  - Input validation and error handling

- 🔍 **Search with Pagination**
  - Efficient server-side filtering of patient records with indexed queries
  - Supports pagination for large datasets

- 📊 **Admin Dashboard**
  - Admin-only interface to view all registered users
  - Excludes sensitive info like passwords and MongoDB `_id`

- 🎨 **Frontend**
  - Clean and responsive UI using **React** and **Tailwind CSS**
  - Authentication-aware navigation and route protection

---

## 🛠️ Tech Stack

### **Frontend**
- React.js
- Tailwind CSS
- Axios
- React Router DOM

### **Backend**
- Python (Flask)
- Flask-JWT-Extended
- Flask-CORS
- Flask-PyMongo

### **Database**
- MongoDB (NoSQL)
- Indexing for optimized search and filtering

---

## 🧰 Installation & Setup

### 📌 Prerequisites
- Python 3.x
- Node.js + npm
- MongoDB running locally or cloud (e.g., MongoDB Atlas)

---

### ⚙️ Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

Flask app will start at: `http://localhost:5000`

---

### 🌐 Frontend Setup

```bash
cd frontend
npm install
npm start
```

React app will start at: `http://localhost:3000`

---

## 🧪 API Endpoints (Sample)

| Method | Endpoint                  | Description                      | Protected |
|--------|---------------------------|----------------------------------|-----------|
| POST   | `/api/login`              | Login for all roles              | ❌        |
| POST   | `/api/patients`           | Create patient record            | ✅        |
| GET    | `/api/patients?page=1`    | Get patients with pagination     | ✅        |
| PUT    | `/api/patients/:id`       | Update patient details           | ✅        |
| DELETE | `/api/patients/:id`       | Delete patient                   | ✅        |
| GET    | `/api/admin/users`        | View all users (Admin only)      | ✅        |

---

## 👤 Roles & Access

| Role          | Access Privileges                    |
|---------------|--------------------------------------|
| **Admin**     | Full access, manage users & patients |
| **Nurse**     | View & edit patient data             |
| **Receptionist** | Add/view patient entries         |

---

## 🧠 Project Structure

```
📦 project-root
├── backend
│   ├── app.py
│   ├── routes/
│   ├── models/
│   └── utils/
├── frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── App.js
├── README.md
```

---
---

## 🧩 Future Improvements

- ✅ Email verification & password reset
- ✅ Deploy on Render/Netlify + MongoDB Atlas
- ⏳ Role-based analytics dashboard
- ⏳ Export patient data to PDF/Excel
- ⏳ Add doctor role and appointment module

---

## 🏁 Conclusion

This project demonstrates a full-stack solution for healthcare systems with secure authentication, clean UI, and scalable architecture. Perfect for hospitals, clinics, or medical institutions.

---

## 📬 Contact

Feel free to connect:

- **LinkedIn**: [linkedin.com/in/raunak0400](https://www.linkedin.com/in/raunak0400)
- **GitHub**: [github.com/raunak0400](https://github.com/raunak0400)
- **Email**: raunakkumarjha233@gmail.com

## 🤝 Acknowledgments  
Special thanks to:  
- The professors for their guidance  
- The open-source community for inspiration  
- Project collaborators for their valuable input  

---  
**Created with ❤️ by a passionate programmer**  
**RAUNAK KUMAR JHA**
