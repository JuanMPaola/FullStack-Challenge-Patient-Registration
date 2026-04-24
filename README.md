# Patient Registration App

A full-stack patient registration application built with NestJS, React, and PostgreSQL. Designed for medical environments requiring secure patient onboarding with document verification.

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
- Swagger API documentation

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

These can be changed via the `ADMIN_EMAIL` and `ADMIN_PASSWORD` environment variables.

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

## Environment Variables

See `.env.example` for all required variables. Key integrations to configure:

| Variable | Description |
|---|---|
| `JWT_SECRET` | Secret key for JWT signing |
| `MAIL_*` | Mailtrap SMTP credentials for email testing |
| `VERIFIK_TOKEN` | Verifik API token for document OCR and verification |
| `R2_*` | Cloudflare R2 credentials for document storage |
| `TWILIO_*` | Twilio credentials — set `SMS_ENABLED=true` to activate |
| `ADMIN_EMAIL` | Default admin account email |
| `ADMIN_PASSWORD` | Default admin account password |

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

1. Add Twilio credentials to `.env`
2. Set `SMS_ENABLED=true`
3. Call `notificationsService.sendRegistrationSms()` where needed

No code changes required — the `SmsStrategy` is already implemented.

## Document Verification

The app uses Verifik to verify Argentine DNI and Uruguayan Cédula de Identidad. The verification adapters are swappable — to change providers, implement the `DocumentVerifier` interface and register the new adapter in `DocumentVerificationFactory`.

To use mock verification (no API credits consumed), the `MockDocumentAdapter` and `MockOcrAdapter` are available for development.