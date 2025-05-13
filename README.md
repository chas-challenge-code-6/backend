# Project Sentinel – API Documentation

## Overview

This API allows communication between IoT sensor devices (e.g., ESP32) and the backend system. It enables real-time data collection, alert handling, and data access for frontend applications.

---

## Endpoints

### 1. Submit Sensor Data

**POST** `/data`

Receives a JSON payload from an ESP32 sensor unit.

#### Request Body

```json
{
  "device_id": "ESP32-001",
  "timestamp": "2025-04-01T12:34:56Z",
  "sensors": {
    "gas": "ppm": 400,
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

#### Response

```json
{
  "status": "success",
  "message": "Data saved successfully"
}
```

---

### 2. Get Latest Sensor Data

**GET** `/data/latest`

Returns the latest sensor data from each device.

#### Response

```json
[
  {
    "device_id": "ESP32-001",
    "timestamp": "2025-04-01T12:34:56Z",
    "temperature": 22.5,
    "humidity": 45,
    "fall_detected": false,
    "device_battery": 85,
    "gas": 400,
    "steps": 1000,
    "heart_rate": 75,
    "noise_level": 80
  }
]
```

---

### 3. Get Device History

**GET** `/data/:device_id`

Query parameters:

- `from`: ISO timestamp (optional)
- `to`: ISO timestamp (optional)

Example:

```plaintext
/data/ESP32-001?from=2025-04-01T00:00:00Z&to=2025-04-01T23:59:59Z
```

#### Response

```json
[
  {
    "timestamp": "2025-04-01T12:34:56Z",
    "temperature": 22.5,
    "humidity": 45,
    "gas": 400,
    "fall_detected": false,
    "device_battery": 85,
    "heart_rate": 75,
    "noise_level": 80
  }
]
```

---

### 4. Get Alerts

**GET** `/alerts`

Returns a list of recent critical alerts (e.g. gas spike, fall detected).

#### Response

```json
[
  {
    "device_id": "ESP32-001",
    "type": "gas",
    "value": 1000,
    "message": "High gas level detected",
    "timestamp": "2025-04-01T13:45:22Z"
  }
]
```

---

## 🔐 Authentication Endpoints

### POST `/auth/register`

Registers a new user.

```json
{
  "username": "yourname",
  "password": "securePass123!",
  "email": "you@email.com"
}
```

### POST `/auth/login`

Logs in a user and returns a JWT token.

### GET `/auth/me`

Returns the logged-in user's profile. Requires Bearer token.

### PATCH `/auth/me`

Updates the user's profile. Partial updates allowed.

### DELETE `/auth/me`

Deletes the authenticated user. Requires Bearer token.

### POST `/auth/forgot-password`

Sends a password reset link via email.

### POST `/auth/reset-password`

Resets password using token from email.

---

## 📟 Device Management

- **POST** `/devices/register`
- **GET** `/devices`
- **GET** `/devices/:id`
- **PATCH** `/devices/:id/settings`

---

## ⚠️ Incident Reporting

- **POST** `/incidents`
- **GET** `/incidents`

---

## 📊 Stats and Analytics

- **GET** `/stats/summary`
- **GET** `/stats/graph/:device_id`

---

## Status Codes

- `200 OK`: Request was successful
- `400 Bad Request`: Missing or malformed data
- `401 Unauthorized`: Missing or invalid token
- `500 Internal Server Error`: Server-side failure

---

## 🛠 Environment Setup

To run the backend locally:

1. Create a `.env.example` file in the root folder (if not already present).
2. Copy it to a new `.env` file:
   ```bash
   cp .env.example .env
   ```
3. Ask a teammate (backend-team) for the correct values (e.g., database credentials, JWT secret).
4. Start your server with:
   ```bash
   npm start
   ```

### Do not commit your `.env` file to Git!

Use `.env.example` in version control, and share `.env` securely with your team.
