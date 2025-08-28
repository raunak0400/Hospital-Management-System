# Hospital Management Information System (HMIS) Backend

This is the backend for a Hospital Management Information System (HMIS) built with Express, TypeScript, and PostgreSQL following an MVC architecture.  
It provides CRUD APIs for users and details tables, and supports a one-to-many relation (a user can have multiple details).

---

## 🚀 Features

- TypeScript + Express + PostgreSQL
- MVC architecture (Models, Services, Controllers, Routes)
- CRUD APIs for users and details
- One-to-many relation (users ↔ details)
- Auto table creation on startup
- Jest + Supertest API tests

---

## 📂 Project Structure

```
Backend-of-app/
│
├── .env
├── package.json
├── README.md
├── tsconfig.json
└── src/
    ├── app.ts
    ├── config/
    │   └── db.ts
    ├── controllers/
    │   ├── detailController.ts
    │   └── userController.ts
    ├── models/
    │   ├── detailModel.ts
    │   └── userModel.ts
    ├── routes/
    │   └── userRoutes.ts
    ├── services/
    │   ├── detailService.ts
    │   └── userService.ts
    └── types/
        └── index.ts
```

---

## ⚙️ Setup

### 1. Clone & Install

```sh
git clone <repo-url>
cd Backend-of-app
npm install
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

### 3. Run Server

```sh
npm run dev
```

Backend will run at:  
👉 http://localhost:5000

---

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