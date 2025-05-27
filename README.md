# backend

Backend

# 🚀 IoT Sensor Backend API

A modern backend API built with **Express.js** and **Sequelize**, designed for collecting, analyzing, and retrieving sensor data from IoT devices like ESP32 units.

**🔗 Live API:** [https://backend-pvrm.onrender.com](https://backend-pvrm.onrender.com)  
**📘 API Docs (Swagger):** `/api-docs`

---

## 📁 Project Structure

```
.
├── controllers/          # Handles business logic
│   ├── authController.js
│   ├── dataController.js
│   └── statsController.js
├── middlewares/          # Custom middleware
│   ├── authenticateToken.js
│   └── validateSensorData.js
├── models/               # Sequelize models
│   ├── index.js
│   ├── sensorData.js
│   └── user.js
├── routes/               # Express route handlers
│   ├── auth.js
│   ├── data.js
│   ├── stats.js
│   └── index.js
├── utils/                # Utility files (mailer, swagger config)
├── .env                  # Environment config (🔓 public for this project)
├── app.js                # Main Express app setup
├── server.js             # Production server entry
├── package.json
└── README.md             # You're here
```

---

## 🛠️ Getting Started

Clone the repo and install dependencies:

```bash
git clone https://github.com/elinstella/backend.git
cd backend
npm install
```

### ▶️ Run locally:

```bash
npm run dev
```

Backend will be available at: `http://localhost:3000`

---

## 🔐 Authentication Flow

### Register

```http
POST /auth/register
```

```json
{
  "username": "testuser",
  "password": "test1234",
  "email": "test@example.com"
}
```

### Login

```http
POST /auth/login
```

Returns a **JWT token**.

### Authenticated Actions (require Bearer token)

- `GET /auth/me` - View profile
- `PATCH /auth/me` - Update profile
- `DELETE /auth/me` - Delete account
- `POST /auth/logout` - Logout (handled client-side)

### Password Recovery

- `POST /auth/forgot-password` – Send reset email
- `POST /auth/reset-password` – Reset using token

---

## 📡 Sensor Data Endpoints

> All routes require a valid JWT token.

### Submit Data

```http
POST /api/data
```

```json
{
  "device_id": "ESP32-001",
  "sensors": {
    "gas": { "ppm": 400 },
    "temperature": 22.5,
    "humidity": 45,
    "fall_detected": false,
    "heart_rate": 75,
    "noise_level": 80,
    "steps": 1000,
    "device_battery": 85
  }
}
```

### Latest per device

```http
GET /api/data/latest
```

### Get history for device

```http
GET /api/data/:device_id?from=...&to=...
```

### Alerts

```http
GET /api/alerts
```

Detects gas > 1000 ppm, fall detection, noise > 100 dB

---

## 📊 Stats & Summary

```http
GET /stats/summary
```

Returns:

- Total entries
- Device count
- Averages for temperature, humidity, etc.

---

## 📝 Notes

> ⚠️ `.env` file is public in this repo **intentionally** for educational purposes.  
> ⚠️ Production apps should **never expose secrets or config like this**.

> Uses **Neon** as the cloud database (PostgreSQL-compatible).

---

## 🧪 Test it

Visit:

- 🔗 [`/api-docs`](https://backend-pvrm.onrender.com/api-docs) – Swagger
- Use [Thunder Client](https://www.thunderclient.com/) or Postman to test requests

---
