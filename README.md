# Personal Finance Dashboard

A full-stack personal finance management application built as a technical assignment for **Sisenco Digital**. It allows users to track income and expenses, manage budgets, and visualise financial data through an interactive dashboard.

---

## Tech Stack

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js + Express | REST API server |
| MySQL (MariaDB) | Relational database |
| mysql2 | Database driver |
| bcryptjs | Password hashing |
| jsonwebtoken | JWT-based authentication |
| express-validator | Request validation |
| dotenv | Environment variable management |
| nodemon | Development auto-reload |

### Frontend
| Technology | Purpose |
|------------|---------|
| React + TypeScript | UI framework |
| Vite | Build tool and dev server |
| React Router | Client-side routing |
| Axios | HTTP client |
| Chart.js + react-chartjs-2 | Data visualisation |
| Tailwind CSS | Utility-first styling |
| Lucide React | Icon library |
| Sonner | Toast notifications |

---

## Features

- **Authentication** — Register and login with JWT-secured sessions
- **Dashboard** — Financial summary with Chart.js charts (income vs expenses, expense by category, budget vs actual)
- **Transactions** — Create, edit, delete, filter, and search income/expense records
- **Categories** — Manage custom income and expense categories
- **Budgets** — Set monthly spending limits per category and track usage

---

## Project Structure

```
sisenco_digital_tech_assignment/
├── backend/
│   └── src/
│       ├── config/          # Database connection pool
│       ├── controllers/     # Route handler logic
│       ├── middleware/      # JWT auth middleware
│       └── routes/          # Express route definitions
├── docs/
│   ├── setup.md             # Detailed setup instructions
│   └── schema.sql           # Database schema
├── frontend/
│   └── src/
│       ├── api/             # Axios instance
│       ├── components/      # Shared UI components
│       ├── pages/           # Page-level route components
│       ├── services/        # API service functions
│       └── types/           # TypeScript type definitions
└── package.json             # Root scripts (Prettier formatter)
```

---

## Quick Start

### 1. Database

```bash
mysql -u root -p your_database_name < docs/schema.sql
```

### 2. Backend

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
PORT=5000
DB_HOST=localhost
DB_USER=your_db_username
DB_PASSWORD=your_db_password
DB_NAME=your_database_name
JWT_SECRET=your_secret_key
```

```bash
npm run dev
```

### 3. Frontend

```bash
cd frontend
npm install
```

Create `frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

> For full step-by-step instructions, see [docs/setup.md](docs/setup.md).

---

## API Overview

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register a new user | Public |
| POST | `/api/auth/login` | Login and receive JWT | Public |
| GET | `/api/dashboard` | Aggregated dashboard data | Private |
| GET / POST | `/api/transactions` | List / create transactions | Private |
| PUT / DELETE | `/api/transactions/:id` | Update / delete transaction | Private |
| GET / POST | `/api/categories` | List / create categories | Private |
| PUT / DELETE | `/api/categories/:id` | Update / delete category | Private |
| GET / POST | `/api/budgets` | List / create budgets | Private |
| PUT | `/api/budgets/:id` | Update budget | Private |
| GET | `/api/health` | Health check | Public |

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` (backend) | Start backend with nodemon |
| `npm run dev` (frontend) | Start Vite dev server |
| `npm run format` (root) | Format all files with Prettier |
