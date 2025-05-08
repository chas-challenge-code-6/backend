# backend
Backend

## 🧭 System Architecture Overview
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
             [ Controllers / Services ]   |
                        |                 |
                        └───[ Sequelize ORM ]────┐
                                                 |
                                 [ PostgreSQL / MySQL / SQLite ]
                                                 |
                              Sensor Data, Users, Stats Tables
                                 |
                                 |
                                 v
                    ┌──────────────────────────┐
                    |       CORS + JWT         |
                    └──────────────────────────┘
                                 |
                        Serves to Frontends
             ┌────────Consumes API (Fetch/Axios)────┐
             |                                      |
      [ Web Frontend ]                       [ Mobile App ]
         (React)                             (React Native)
