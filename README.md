# Ask the Expert Portal

Clickable Next.js prototype for Morgan Advanced Materials Thermal Ceramics.

## Repository Structure

```text
.
├── documents/       Requirements DOCX, prototype PPTX, extracted text
├── media/           Source presentation and reference media
├── portal/
│   ├── app/
│   │   ├── components/   Shared application chrome
│   │   ├── lib/          Seed data and official-site index mock
│   │   ├── (routes)/     Portal, expert, admin, and support pages
│   │   └── globals.css  Shared design system
│   ├── public/          Browser-served images and logo assets
│   └── package.json
└── README.md
```

## Run the Prototype

```powershell
cd portal
npm install
npm run dev
```

Open `http://localhost:3000`.

## Production Build

```powershell
cd portal
npm run build
```

## Key Routes

- `/` — Search-first customer portal
- `/categories` — Product category catalogue
- `/tools` — Technical tools
- `/documents` — Indexed technical documents
- `/questions` — Customer question threads
- `/expert` — Morgan expert workspace
- `/admin` — Super Admin dashboard
- `/sign-in` — Email and OTP prototype flow

The prototype uses local seed data and a mock indexed official-site AI response layer. Supabase, Entra ID, live chat, and production AI integrations can replace this data layer later.

## Component Documentation

See [`documents/COMPONENTS.md`](documents/COMPONENTS.md) for the shared application chrome, route/component map, data modules and cleanup conventions.