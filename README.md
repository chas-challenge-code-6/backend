# Project Sentinel – Backend

This is the backend API for Project Sentinel, a real-time IoT monitoring system for sensor-equipped ESP32 devices. It supports data collection, alert detection, authentication, and device/user management.

## 📦 Technologies Used

- Node.js
- Express.js
- Sequelize (ORM)
- PostgreSQL (or other SQL dialect)
- JWT Authentication
- dotenv for configuration
- Nodemon for development

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/project-sentinel-backend.git
cd project-sentinel-backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root of the project with the following keys:

```env
DB_NAME=your_database
DB_USER=your_username
DB_PASS=your_password
DB_HOST=localhost
DB_DIALECT=postgres
JWT_SECRET=your_jwt_secret
```

### 4. Start the server

```bash
npm run dev
```

---

## 📡 API Endpoints

### 🔍 Sensor Data

#### `POST /data`

Receive sensor data from ESP32.

```json
{
  "device_id": "ESP32-001",
  "timestamp": "2025-04-01T12:34:56Z",
  "sensors": {
    "gas": 400,
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

#### `GET /data/latest`

Returns the latest sensor data for all devices.

#### `GET /data/:device_id`

Returns historical data for a specific device.  
**Optional query params**: `from`, `to` (ISO timestamps)

---

### 🚨 Alerts

#### `GET /alerts`

Returns a list of recent critical alerts.

---

### 🔐 Authentication

#### `POST /auth/register`

Register a new user.

#### `POST /auth/login`

Login and receive a JWT token.

#### `GET /auth/me`

Get current user's profile (auth required).

#### `PATCH /auth/me`

Update user profile (auth required).

#### `DELETE /auth/me`

Delete user account (auth required).

#### `POST /auth/forgot-password`

Send password reset email.

#### `POST /auth/reset-password`

Reset password with token.

---

### ⚙️ Devices

#### `POST /devices/register`

Register a new device.

#### `GET /devices`

List all registered devices.

#### `GET /devices/:id`

Get info on a specific device.

#### `PATCH /devices/:id/settings`

Update device settings.

---

### 📊 Analytics

#### `GET /stats/summary`

Returns summary statistics across all devices.

#### `GET /stats/graph/:device_id`

Returns time-series data for a device for graphing.

---

### 🛠 Incident Management

#### `POST /incidents`

Create a new incident report.

#### `GET /incidents`

List reported incidents.

---

## 🗄 Database Models

### `sensor_data`

| Field          | Type     |
| -------------- | -------- |
| id             | UUID     |
| timestamp      | datetime |
| device_id      | string   |
| temperature    | float    |
| humidity       | int      |
| gas            | int      |
| fall_detected  | boolean  |
| heart_rate     | int      |
| noise_level    | int      |
| steps          | int      |
| device_battery | int      |
| watch_battery  | int      |

### `users`

| Field         | Type                |
| ------------- | ------------------- |
| id            | UUID                |
| name          | string              |
| email         | string              |
| password_hash | string              |
| role          | string (admin/user) |
| phone_number  | string (optional)   |
| workplace     | string (optional)   |
| job_title     | string (optional)   |

---

## 📬 Contact

For questions, contact the development team or open an issue on GitHub.
