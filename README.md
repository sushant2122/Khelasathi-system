# KhelaSathi System ⚽

KhelaSathi is a **real-time futsal booking system** built with the **PERN stack**, featuring **multi-tenancy architecture** for managing multiple futsal venues and a fully **Dockerized deployment** for scalable environments.  

It allows players to book futsal courts, manage bookings, receive verification notifications, and earn credit points, while venue owners can manage courts, bookings, and payments efficiently.

---

## 🚀 Key Features

| Feature | Description |
|---------|------------|
| Multi-Tenancy | Manage multiple futsal venues with isolated data per tenant |
| Real-Time Booking | Live updates on available slots via Socket.IO |
| Booking Management | Create, cancel, and reschedule bookings |
| Payment Integration | Khalti payment gateway support for secure transactions |
| Rewards System | Credit points for users based on activity |
| Notifications | Real-time notifications for account verification updates |
| Admin Dashboard | Manage venues, bookings, and transactions |
|  Responsive Design | Optimized for all device sizes|
| Media Handling | Upload images via Cloudinary |
| Security | JWT authentication with role-based access control |

---

## 🛠 Tech Stack

- **Frontend:** React.js + flowbite + Tailwind CSS
- **Backend:** Node.js + Express.js + PostgreSQL + Socket.IO  
- **Authentication:** JWT  
- **Payments:** Khalti API  
- **Storage:** Cloudinary  
- **Deployment:** Docker + Docker Compose
- **Security:** Bcrypt
  
---

## ⚙️ Prerequisites

- Install **Docker** on your computer: [Docker Installation Guide](https://docs.docker.com/get-docker/)  
- Make sure ports **5173** (frontend) and **9005** (backend) are free  

---
## 📂 Project Structure
```bash
Khelasathi-system/
├── frontend/ # React frontend
│ ├── .env.example # Sample environment file
├── backend/ # Node.js backend
│ ├── .env.example # Sample environment file
├── docker-compose.yml
├── .gitignore
└── README.md
```
---
## 🔧 Environment Setup

Both frontend and backend have `.env.example` files.  
You need to create `.env` in **both folders** based on the examples.

### Frontend

1. Go to the frontend folder:
```bash
cd frontend
```
2. Copy the sample file::
```bash
cp .env.example .env
```
3. Edit .env with your configuration (e.g., backend API URL):
```bash
VITE_API_URL=http://localhost:9005
```
### Backend

1. Go to the backend folder:
```bash
cd backend
```
2. Copy the sample file:
```bash 
cp .env.example .env
```
3. Edit .env with your configuration:
```bash
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

SMTP_HOST= your_host
SMTP_PORT= your_port
SMTP_USER= your_user
SMTP_PASSWORD= your_password
SMTP_SECURE= false

SMTP_FROM= your_user_email

KHALTI_SECRET_KEY = your_khalti_secret
FRONTEND_URL=http://localhost:5173

PG_USER=your_db_user
PG_PASSWORD=your_db_password
PG_HOST = db
PG_DIALECT = postgres
PG_DATABASE = Khelasathi

JWT_SECRET = your_jwt_secret
```
---
## 📲 Running project
> ⚠️ **Note:** Open the terminal from Docker Desktop before running these commands.
1. From the root project folder (Khelasathi-system):
```bash
docker compose up --build
```
- This will build and start both frontend and backend containers.
- Access the frontend at: http://localhost:5173
- Backend API runs at: http://localhost:9005
2. To stop the containers:
```bash
docker compose down
```