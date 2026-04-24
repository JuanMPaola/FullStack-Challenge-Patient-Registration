# Patient Registration App

A full-stack patient registration application built with NestJS, React, and PostgreSQL. Designed for medical environments requiring secure patient onboarding with document verification.

## Live Demo

https://patients-app-frontend-production.up.railway.app/login

## Tech Stack

**Backend:** NestJS · TypeScript · TypeORM · PostgreSQL · Redis · Bull
**Frontend:** React · TypeScript · Vite · Tailwind CSS
**Infrastructure:** Docker · Docker Compose
**Services:** Cloudflare R2 · Verifik · Mailtrap · Twilio (ready)

## Features

- Patient registration with document scanning via Verifik OCR
- Document verification for 🇦🇷 Argentine DNI and 🇺🇾 Uruguayan Cédula de Identidad
- Photo upload and storage on Cloudflare R2
- Async email confirmation via Bull + Redis queue
- JWT authentication with role-based access (admin / patient)
- 3-step patient registration flow with camera capture support
- SMS notification support ready to enable (Twilio)
- Admin seeder on startup
- Swagger API documentation at /api

## Architecture Patterns

- **Repository Pattern** — data access abstraction
- **Strategy Pattern** — notification channels (email/SMS)
- **Adapter Pattern** — document verification providers (AR/UY)
- **Factory Pattern** — runtime adapter selection

## Getting Started

### Prerequisites

- Docker
- Docker Compose

### Setup

1. Clone the repository

2. Copy the environment file and fill in your credentials:

    cp .env.example .env

3. Start all services:

    docker compose up --build

The app will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000
- Swagger Docs: http://localhost:3000/api

### Default Admin Credentials

    email: admin@admin.com
    password: admin123

These can be changed via the ADMIN_EMAIL and ADMIN_PASSWORD environment variables.

### Local Development (without Docker)

Start only the infrastructure services:

    docker compose up postgres redis

Run the backend locally:

    cd backend
    npm install
    npm run start:dev

Run the frontend locally:

    cd frontend
    npm install
    npm run dev

## API Documentation

The API is documented with Swagger. Once the backend is running, visit /api to explore all endpoints interactively. The documentation includes request/response schemas, authentication requirements, and example payloads for all routes.

## Environment Variables

See .env.example for all required variables. Key integrations to configure:

| Variable | Description |
|---|---|
| JWT_SECRET | Secret key for JWT signing |
| MAIL_* | Mailtrap SMTP credentials for email testing |
| VERIFIK_TOKEN | Verifik API token for document OCR and verification |
| R2_* | Cloudflare R2 credentials for document storage |
| TWILIO_* | Twilio credentials — set SMS_ENABLED=true to activate |
| ADMIN_EMAIL | Default admin account email |
| ADMIN_PASSWORD | Default admin account password |

## Project Structure

    patient-registration/
    ├── docker-compose.yml
    ├── .env.example
    ├── backend/
    │   └── src/
    │       ├── modules/
    │       │   ├── auth/                   # JWT auth, guards, decorators
    │       │   ├── patients/               # Patient CRUD
    │       │   ├── users/                  # User management
    │       │   ├── notifications/          # Email (Bull) + SMS (Twilio stub)
    │       │   ├── document-verification/  # Verifik OCR + adapters
    │       │   └── storage/               # Cloudflare R2
    │       └── database/
    │           └── seeders/               # Admin seeder
    └── frontend/
        └── src/
            ├── api/                       # HTTP layer
            ├── components/
            │   ├── auth/                  # Login, Register (3-step flow)
            │   ├── patients/              # PatientCard, PatientForm
            │   └── ui/                    # Base components
            ├── context/                   # AuthContext
            ├── hooks/                     # usePatients, useAuthForm
            ├── pages/                     # PatientsPage, PatientProfilePage, LoginPage
            └── types/                     # TypeScript interfaces

## SMS Notifications

SMS support is built and ready. To activate within 2 months:

1. Add Twilio credentials to .env
2. Set SMS_ENABLED=true
3. Call notificationsService.sendRegistrationSms() where needed

No code changes required — the SmsStrategy is already implemented.

## Document Verification

The app uses Verifik to verify Argentine DNI and Uruguayan Cédula de Identidad. The verification adapters are swappable — to change providers, implement the DocumentVerifier interface and register the new adapter in DocumentVerificationFactory.

To use mock verification (no API credits consumed), the MockDocumentAdapter and MockOcrAdapter are available for development.

## Future Improvements

- **JWT Secret configuration** — Currently falls back to a default value if JWT_SECRET is not set. In production, always set a strong random secret via environment variables.
- **JWT config module** — Centralize JWT configuration using a dedicated config module (jwtConfig) consistent with the rest of the app's config pattern.
- **Document verification flow** — Two-step verification: scan document first, then validate number against Verifik's database records.
- **SMS notifications** — Twilio integration is ready, set SMS_ENABLED=true and add credentials to activate.
- **Production email domain** — Configure a verified sending domain in Mailtrap for production email delivery to any address.
- **Migrations** — Replace TypeORM synchronize with proper migration files for production database management.
- **Refresh tokens** — Add refresh token support for better session management.

## Deployment

The application is deployed on Railway. Each service (backend, frontend, postgres, redis) runs as an independent Railway service.

To deploy your own instance:
- Create a Railway project with four services: backend, frontend, postgres, redis
- Set all required environment variables in each service dashboard
- Use the provided Dockerfiles for backend and frontend builds

For production, ensure:
- NODE_ENV=production
- All third-party credentials are set (Verifik, R2, Mailtrap, JWT_SECRET)
- ADMIN_EMAIL and ADMIN_PASSWORD are changed from defaults