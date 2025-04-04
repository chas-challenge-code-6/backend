# backend
Backend

API- och Databasspecifikation – Projekt Sentinel
1. Grundläggande API-endpoints
POST /api/data
- Tar emot sensordata från ESP32-enheter i JSON-format.
- Exempeldata:
{
"device_id": "ESP32-001",
"timestamp": "2025-04-01T12:34:56Z",
"sensors": {
"gas": {"co2": 400, "co": 15},
"temperature": 22.5,
"humidity": 45,
"acceleration": {"x": 0.2, "y": -0.1, "z": 9.8},
"heart_rate": 75,
"noise_level": 80,
"battery": 85
}
}
GET /api/data/latest
- Returnerar den senaste posten med sensordata per enhet till frontend.
GET /api/data/:device_id
- Returnerar historisk data för specifik enhet (tidsintervall som query-param).
GET /api/alerts
- Returnerar larm baserade på farliga nivåer (gas, ljud, fall etc).
2. Databasmodell – sensor_data
Tabell: sensor_data
- id (UUID)
- timestamp (datetime)
- device_id (string)
- temperature (float)
- humidity (int)
- co2 (int)
- co (int)
- acceleration_x/y/z (float)
- heart_rate (int)
- noise_level (int)
- battery (int)
3. Databasmodell – users (framtida utveckling)
Tabell: users
- id (UUID)
- name (string)
- email (string)
- password_hash (string)
- role (admin/user)
Används för framtida åtkomstkontroll och visning av data kopplad till användare.
4. Tips för implementation
- Börja med Express-generator för grundstruktur
- Använd .env för databaskoppling (dotenv-paketet)
- Sequelize ORM för att underlätta databasmodellering
- Testa endpoints i Postman tidigt
- Skapa middleware för JSON-validation av sensordata
