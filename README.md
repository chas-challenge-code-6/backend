# backend
Backend

## 🧭 System Architecture Overview
<pre> ```txt [ Hardware Device(s) ] | Sends JSON via HTTP / MQTT | v [ Express.js API Server ] | ┌─────────────┴──────────────┐ | | [ Middleware Layer ] [ Route Handlers ] (Auth, Validation, etc.) (auth, data, stats) | ┌────────┴────────┐ | | [ Controllers / Services ] | | | └────[ Sequelize ORM ]────┐ | [ PostgreSQL / MySQL / SQLite ] | Sensor Data, Users, Stats Tables | v ┌──────────────────────────┐ | CORS + JWT | └──────────────────────────┘ | Serves to Frontends ┌───────────────────────────────┐ | | [ Web Frontend ] [ Mobile App ] (React, Vue, etc.) (React Native, Flutter, etc.) | | └───── Consumes API (Fetch/Axios) ─────┘ ``` </pre>
