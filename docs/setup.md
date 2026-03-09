# Setup Instructions

A step-by-step guide to set up and run the **Sisenco Personal Finance Dashboard** locally.

---

## Prerequisites

Make sure the following are installed before proceeding:

| Tool | Version | Notes |
|------|---------|-------|
| Node.js | v18 or higher | [nodejs.org](https://nodejs.org) |
| npm | Comes with Node.js | |
| MySQL | v8 or higher | [mysql.com](https://dev.mysql.com/downloads) |

---

## 1. Clone the Repository

```bash
git clone <repository-url>
cd sisenco_digital_tech_assignment
```

---

## 2. Database Setup

1. Open your MySQL client (e.g., MySQL Workbench or CLI).
2. Create the database:
   ```sql
   CREATE DATABASE your_database_name;
   ```
3. Import the schema from `docs/schema.sql` to create all required tables:
   ```bash
   mysql -u root -p your_database_name < docs/schema.sql
   ```

> The schema file creates the following tables: `users`, `categories`, `transactions`, and `budgets`.

---

## 3. Backend Setup

### Install Dependencies

```bash
cd backend
npm install
```

### Configure Environment Variables

Create a `.env` file inside the `backend/` directory:

```env
PORT=5000
DB_HOST=localhost
DB_USER=your_db_username
DB_PASSWORD=your_db_password
DB_NAME=your_database_name
JWT_SECRET=your_super_secret_key
```

> **Note:** Replace the values with your actual database credentials. The `JWT_SECRET` can be any long random string.

### Start the Backend Server

```bash
npm run dev
```

The backend API will be running at `http://localhost:5000`.

---

## 4. Frontend Setup

Open a **new terminal** and navigate to the `frontend/` directory.

### Install Dependencies

```bash
cd frontend
npm install
```

### Configure Environment Variables

Create a `.env` file inside the `frontend/` directory:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

> **Note:** Update the URL if your backend runs on a different port.

### Start the Frontend Dev Server

```bash
npm run dev
```

The application will be accessible at `http://localhost:5173`.

---

## 5. Format Code (Optional)

A Prettier formatter is configured at the root level. Run it from the project root:

```bash
npm run format
```

---

## API Endpoints Overview

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register a new user | Public |
| POST | `/api/auth/login` | Login and receive a JWT | Public |
| GET | `/api/dashboard` | Get dashboard metrics | Private |
| GET | `/api/transactions` | List transactions | Private |
| POST | `/api/transactions` | Create a transaction | Private |
| PUT | `/api/transactions/:id` | Update a transaction | Private |
| DELETE | `/api/transactions/:id` | Delete a transaction | Private |
| GET | `/api/categories` | List categories | Private |
| POST | `/api/categories` | Create a category | Private |
| PUT | `/api/categories/:id` | Update a category | Private |
| DELETE | `/api/categories/:id` | Delete a category | Private |
| GET | `/api/budgets` | List budgets | Private |
| POST | `/api/budgets` | Create a budget | Private |
| PUT | `/api/budgets/:id` | Update a budget | Private |
| GET | `/api/health` | Health check | Public |

---

## Project Structure

```
sisenco_digital_tech_assignment/
├── backend/
│   └── src/
│       ├── config/          # Database configuration
│       ├── controllers/     # Request handlers
│       ├── middleware/      # Auth middleware
│       └── routes/          # API route definitions
├── docs/
│   └── setup.md             # This file
└── frontend/
    └── src/
        ├── api/             # Axios instance
        ├── components/      # Shared UI components
        ├── pages/           # Page-level components
        ├── services/        # API service functions
        └── types/           # TypeScript type definitions
```
