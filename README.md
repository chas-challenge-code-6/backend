# backend

Backend

# 🚀 IoT Sensor Backend API

A modern backend API built with **Express.js** and **Sequelize**, designed for collecting, analyzing, and retrieving sensor data from IoT devices like ESP32 units.

**🔗 Live API:** [https://backend-belz.onrender.com](https://backend-belz.onrender.com)  
**📘 API Docs (Swagger):** `/api-docs`

---

## 📁 Project Structure

```
                     [ Hardware Device(s) ]
                             |
                Sends JSON via HTTP / MQTT
                             |
                             v
                  [ Express.js API Server ]
                             |
               ┌─────────────┴──────────────┐
               |                            |
     [ Middleware Layer ]        [ Route Handlers ]
  (Auth, Validation, etc.)     (auth, data, stats)

                             |
                    ┌────────┴────────┐
                    |                 |
         [ Controllers            Services ]   
                    |                 |
                    └───[ Sequelize ORM ]────┐
                                             |
                                       [ PostgreSQL  ]
                                             |
                          Sensor Data, Users, Stats Tables
                             |
                             |
                             v
                ┌──────────────────────────┐
                |           JWT            |
                └──────────────────────────┘
                             |
                    Serves to Frontends
         ┌────────Consumes API    ( Fetch  )────┐
         |                                      |
  [ Web Frontend ]                       [ Mobile App ]
     (React)                             (React Native)****

---

## 🛠️ Getting Started

Clone the repo and install dependencies:

```bash
git clone https://github.com/chas-challenge-code-6/backend    or    https://github.com/elinstella/backend.git
cd backend
npm install
npm run dev
```

### ▶️ Run locally:

```bash
cd backend
npm install
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
    "device_battery": 85,
    "strap_battery": 100
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

- 🔗 [`/api-docs`](https://backend-belz.onrender.com/api-docs) – Swagger
- Use [Thunder Client](https://www.thunderclient.com/) or Postman to test requests

---
