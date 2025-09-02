# 🏥 Hospital Management System Backend

This is a **TypeScript + Express** backend for a Hospital Management System.  
It provides **CRUD APIs** for managing Users and their Medical Details (symptoms, treatment, doctor receipts).  
The backend uses **PostgreSQL** as the database and supports **Dockerized development**.

---

## 🚀 Features
- **TypeScript + Express** backend (MVC architecture)  
- **PostgreSQL** database with two tables:  
  - `users` → id, name, age, address, contact  
  - `details` → id, user_id (FK), symptoms, treatment, image (receipt)  
- **One-to-Many relationship** (User → Details)  
- **CRUD APIs** for both tables  
- **File upload** support using Multer (doctor receipts)  
- **Docker & Docker Compose** setup for local development  

---

## 📂 Project Structure

```
Backend-of-app/
├── src/
│   ├── controllers/        # API controllers
│   ├── services/           # Business logic (UserService, DetailService)
│   ├── routes/             # Single route file (all APIs)
│   ├── db/                 # Database connection + initDB
│   ├── middleware/         # Middleware (file upload, error handling)
│   ├── app.ts              # Express app setup
│   └── server.ts           # Entry point (starts server)
│
├── uploads/                # Uploaded doctor receipts
├── Dockerfile.dev          # Development Dockerfile
├── docker-compose.yml      # Compose config (Backend + Postgres)
├── package.json
├── tsconfig.json
└── README.md
```

---

## ⚙️ Setup

## Docker Setup
1️⃣ Prerequisites

    * Install [Docker Desktop](https://www.docker.com/products/docker-desktop)

    * Make sure Docker is running
2️⃣ Start the Services

    ```
    # Build and start backend + database
    docker-compose build --no-cache

    docker-compose up

    ```
    This will start:

    hmis_db → PostgreSQL (port 5432)

    hmis_backend → Express server (port 6010 by default)

3️⃣ Stop the Services
```
docker-compose down
```

To remove volumes (clean DB):

```
docker-compose down -v
```
---
## Local Setup (Without Docker)
### 1. Clone & Install

```sh
git clone https://github.com/raunak0400/Hospital-Management-System.git

cd Project/Backend-of-app

npm install

npm run build # Build the TypeScript code

npm run dev # Start the development server

npm start # Start the production server

```

### 2. Configure Environment

Create a `.env` file:

```
PORT=5000
DB_USER=your_username
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=hospital_db
```


## 🗄️ Database

Tables are auto-created on startup:

**users**
```sql
id SERIAL PRIMARY KEY,
name VARCHAR(100),
age INT,
address TEXT,
contact VARCHAR(20)
```

**details**
```sql
id SERIAL PRIMARY KEY,
user_id INT REFERENCES users(id) ON DELETE CASCADE,
symptoms TEXT,
treatment TEXT,
image TEXT
```

---

## 📡 API Endpoints

### Users

- `GET /api/users` → Get all users
- `GET /api/users/:id` → Get user by ID
- `POST /api/users` → Create user
- `PUT /api/users/:id` → Update user
- `DELETE /api/users/:id` → Delete user
- `GET /api/users/:id/details` → Get user with details (join)

### Details

- `GET /api/details` → Get all details
- `GET /api/details/:id` → Get detail by ID
- `POST /api/details` → Create detail
- `PUT /api/details/:id` → Update detail
- `DELETE /api/details/:id` → Delete detail

---

## 🧪 Running Tests

```sh
npm test
```

Covers:

- Users CRUD
- Details CRUD
- Join query (user)