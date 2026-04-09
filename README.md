# 🏙️ UrbnConnect

> **Report. Act. Sustain.**
>
> *UrbnConnect is a civic-tech platform that enables citizens to report local urban issues while helping authorities track, manage, and improve community sustainability transparently.*

---

## 📖 Overview

UrbnConnect bridges the gap between **citizens and local government** by providing a unified platform to:

- 📝 Report civic issues (potholes, drainage, stray animals, encroachments, and more)
- 📊 Track issue resolution in real time with transparent status updates
- 🗺️ Visualise problems on an interactive ward-level map
- 🌿 Monitor green cover, flag deficit zones, and get area-wise plantation recommendations
- 🏛️ Enable authorities to manage, prioritise, and resolve issues efficiently

Built as a hackathon project by **Team Infinite Loop** — students from USICT, GGSIPU, New Delhi.

---

## ✨ Features

### 👥 For Citizens

| Feature | Description |
|---|---|
| **Report a Problem** | Submit civic issues with photos, location, category, and severity in under 2 minutes |
| **Locality Problems** | Browse, search, and filter all reported issues in your area |
| **Upvote Issues** | Support issues reported by others to signal community impact |
| **Map View** | See all reported issues visualised on an interactive Leaflet map |
| **Area Insights** | Ward-level civic health scores, category breakdowns, and actionable recommendations |
| **Green Intelligence** | Real-time tree coverage map, deficit zone analysis, and area-wise plantation goals |
| **Anonymous Reporting** | Submit reports without revealing your identity to other citizens |
| **OTP / Email Login** | Secure sign-in via SMS OTP or email + password |
| **Guest Mode** | Explore the platform read-only without creating an account |

### 🏛️ For Authorities

| Feature | Description |
|---|---|
| **Authority Dashboard** | Overview of all issues by status, category, and severity |
| **Issue Management** | Update issue status through the full lifecycle: Reported → In Progress → Resolved |
| **Priority Tracking** | Surface critical open issues requiring urgent attention |
| **Analytics** | Category-wise and ward-wise issue distribution |

### 🌿 Green Urban Intelligence

| Feature | Description |
|---|---|
| **Tree Coverage Map** | Interactive colour-coded circles showing green cover % per zone |
| **KPI Cards** | Total Trees Mapped, Trees Needed, Avg Coverage, Deficit Zones |
| **Area Recommendations** | Specific, prioritised plantation plans per locality |
| **Green Suggestions** | Solar micro-grids, rainwater harvesting, green lanes, green building mandates |
| **Report Low Greenery** | Dedicated issue category for deforestation and greenery deficits |

### 🌐 Platform-Wide

- **Bilingual UI** — Full English 🇬🇧 and Hindi 🇮🇳 translation across all pages
- **Dark / Light Mode** — Adapts to system preference
- **Fully Responsive** — Works on mobile, tablet, and desktop

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [React 19](https://react.dev/) + [TypeScript 5.9](https://www.typescriptlang.org/) |
| **Build Tool** | [Vite 8](https://vitejs.dev/) |
| **Routing** | [React Router v7](https://reactrouter.com/) |
| **Maps** | [Leaflet](https://leafletjs.com/) + [React Leaflet 5](https://react-leaflet.js.org/) |
| **Backend / Auth / DB** | [Supabase](https://supabase.com/) (PostgreSQL + Auth + Storage) |
| **Styling** | Vanilla CSS with a custom `cv-*` design system (no Tailwind / Bootstrap) |
| **Fonts** | [Inter — Google Fonts](https://fonts.google.com/specimen/Inter) |

---

## 🗂️ Project Structure

```
UrbnConnect/
├── public/
├── src/
│   ├── components/
│   │   ├── layout/           # Navbar, Sidebar, Layout wrapper
│   │   └── ui/               # Shared UI (cards, chips, badges)
│   ├── context/
│   │   └── AppContext.tsx    # Global state: auth, issues, language toggle
│   ├── i18n/
│   │   └── translations.ts  # English + Hindi string map
│   ├── mockData/
│   │   ├── categories.ts    # Issue categories, severity, status options
│   │   └── issues.ts        # Seed issues for offline demo
│   ├── pages/
│   │   ├── LandingPage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── CitizenDashboard.tsx
│   │   ├── AuthorityDashboard.tsx
│   │   ├── ReportProblemPage.tsx
│   │   ├── IssuesListPage.tsx
│   │   ├── IssueDetailPage.tsx
│   │   ├── MapViewPage.tsx
│   │   ├── AreaInsightsPage.tsx
│   │   ├── SustainabilityPage.tsx
│   │   ├── ProfilePage.tsx
│   │   ├── AboutUsPage.tsx
│   │   └── ContactUsPage.tsx
│   ├── types.ts              # TypeScript interfaces and enums
│   ├── App.tsx               # Route definitions
│   └── main.tsx              # Entry point
├── .env.local                # Supabase credentials (not committed)
├── index.html
├── vite.config.ts
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** v18 or higher
- **npm** v9 or higher
- A [Supabase](https://supabase.com/) project (free tier works)

### 1. Clone the repository

```bash
git clone https://github.com/your-org/urbnconnect.git
cd urbnconnect
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create `.env.local` in the project root:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

> Get these from your Supabase project → **Settings → API**.  
> Without this file, the app falls back to **local mock data** for offline demo use.

### 4. Start the development server

```bash
npm run dev
```

Open **http://localhost:5173** in your browser.

### 5. Build for production

```bash
npm run build
```

---

## 🗺️ Page Routes

| Route | Page | Access |
|---|---|---|
| `/` | Landing Page | Public |
| `/login` | Login (Citizen / Authority) | Public |
| `/about` | About Us | Public |
| `/contact` | Contact Us | Public |
| `/dashboard` | Citizen Dashboard | Citizen |
| `/report` | Report a Problem | Citizen |
| `/issues` | Locality Problems | Citizen |
| `/map` | Map View | Citizen |
| `/area-insights` | Area Insights | Citizen |
| `/sustainability` | Green Intelligence | Citizen |
| `/profile` | Profile | Citizen |
| `/authority` | Authority Dashboard | Authority |
| `/authority/issues` | All Issues (Authority) | Authority |

---

## 🗃️ Issue Categories

| Category | ID |
|---|---|
| Sanitation & Waste | `sanitation-waste` |
| Water & Drainage | `water-drainage` |
| Roads & Infrastructure | `roads-infrastructure` |
| Streetlights & Electricity | `streetlights-electricity` |
| Environment Damage | `environment-damage` |
| **Low Greenery / Deforestation** | `low-greenery-deforestation` |
| Animal–Human Conflict | `animal-human-conflict` |
| Citizen Safety | `citizen-safety` |
| Public Health | `public-health` |
| Illegal Encroachment | `illegal-encroachment` |
| Noise / Nuisance | `noise-nuisance` |
| Public Property Damage | `public-property-damage` |
| Other | `other` |

---

## 🔐 Authentication

UrbnConnect supports two sign-in methods:

1. **Email + Password** via Supabase Auth
2. **Mobile OTP (SMS)** via Supabase Phone Auth

At login, users select their role — **Citizen** or **Authority** — which determines dashboard access and features available.

### Supabase RLS Setup

Run these in your Supabase SQL Editor to enable anonymous and authenticated inserts:

```sql
-- Allow anonymous guests to insert issues
CREATE POLICY "Allow anonymous inserts"
  ON public.cv_issues FOR INSERT TO anon WITH CHECK (true);

-- Allow anonymous guests to update issues (upvotes)
CREATE POLICY "Allow anonymous updates"
  ON public.cv_issues FOR UPDATE TO anon USING (true);
```

---

## 🌐 Internationalisation (i18n)

All UI strings are maintained in `src/i18n/translations.ts` under two language keys:

- `en` — English (default)
- `hi` — हिंदी (Hindi)

Language is toggled via the Navbar switcher and stored in `AppContext`. To add a new language, add a matching key block in the translations file.

---

## 👨‍💻 Team

**Team Infinite Loop** — USICT, GGSIPU, New Delhi

| Name | Role |
|---|---|
| Sanyam Aggarwal | Team Lead & Full-Stack Developer |
| Harshit | Frontend Developer |
| Manya | UI/UX & Research |
| Harsh | Backend & Database |

---

## 📄 License

This project was built for the **HackBVP Hackathon**. All rights reserved by Team Infinite Loop.

---

<div align="center">
  <sub>Built with ❤️ for smarter, greener, and more transparent cities.</sub>
</div>
