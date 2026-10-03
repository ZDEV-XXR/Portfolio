# Hamza Lemghari — Portfolio & Engineering Showcase

A modern, high-performance developer portfolio and project management system built with Next.js 15.5, React 19, Tailwind CSS v4, and Supabase.

---

## ⚡ Tech Stack

- **Framework**: [Next.js 15.5](https://nextjs.org/) (App Router, Server Components & Server-side Route Handlers)
- **UI Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with native `@theme` tokens and dark variant support
- **Animations**: [Framer Motion 12](https://www.framer.com/motion/)
- **Database**: [Supabase](https://supabase.com/) (`@supabase/supabase-js`)
- **Theme Support**: `next-themes` (Dark / Light mode with system preference detection)
- **Analytics & Insights**: `@vercel/speed-insights`
- **Contact Service**: Formspree integration

---

## 📁 Project Architecture

```text
Portfolio/
├── public/
│   └── me.jpg                        # Profile avatar & metadata icon
├── src/
│   ├── app/
│   │   ├── layout.tsx                # Root layout: Providers, Navbar, Footer, SpeedInsights
│   │   ├── page.tsx                  # Single-page portfolio (Hero, About, Skills, Projects, Contact)
│   │   ├── globals.css               # Tailwind CSS v4 directives and color tokens
│   │   ├── admin/
│   │   │   ├── page.tsx              # Server Component: checks HMAC auth cookie -> LoginForm or Console
│   │   │   └── AdminConsole.tsx      # Admin management client container
│   │   └── api/
│   │       ├── auth/
│   │       │   └── route.ts          # POST (rate-limited login) & DELETE (logout)
│   │       └── projects/
│   │           └── route.ts          # POST, PUT, DELETE (cookie-authorized, server-only Supabase DB client)
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx            # Sticky navigation dock, smooth scroll-spy & CV modal
│   │   │   ├── Footer.tsx            # Site footer and social links
│   │   │   ├── Providers.tsx         # Dark/light theme provider wrapper
│   │   │   └── ThemeToggle.tsx       # Animated theme switch button
│   │   ├── sections/
│   │   │   ├── Hero.tsx              # Hero profile intro section
│   │   │   ├── About.tsx             # Professional biography and summary
│   │   │   ├── Skills.tsx            # Categorized skills matrix with icons
│   │   │   ├── Projects.tsx          # Project showcase grid with interactive detail previews
│   │   │   └── Contact.tsx           # Contact form powered by Formspree
│   │   └── admin/
│   │       ├── LoginForm.tsx         # Password authentication form
│   │       ├── ProjectForm.tsx       # Project creation form with validation & image preview
│   │       └── ProjectsTable.tsx     # Project data table: search, filter, edit, delete & logout
│   └── lib/
│       ├── auth.ts                   # Web Crypto HMAC-SHA256 token creation and verification
│       ├── db.ts                     # Public Supabase client and read-only fetchers
│       ├── db-server.ts              # Server-only Supabase client (SUPABASE_SERVICE_ROLE_KEY)
│       └── types.ts                  # Shared TypeScript interfaces, categories & tech stack parser
├── .env.example                      # Template for required environment variables
├── .env.local                        # Local environment secrets (strictly git-ignored)
├── eslint.config.mjs                 # Flat ESLint 9 configuration
├── next.config.ts                    # Next.js configuration with legacy route redirects
├── package.json                      # Project dependencies and scripts
├── postcss.config.mjs                # PostCSS configuration for Tailwind v4
└── tsconfig.json                     # TypeScript strict configuration
```

---

## 🔐 Security Architecture

1. **Server-Side Authentication**:
   - The `/admin` route is a Server Component (`export const dynamic = "force-dynamic"`). It checks the `add_project_access` cookie before serving any management interface.
   - Unauthorized requests immediately render the `<LoginForm />` without serving administrative logic or data.
2. **Secure HMAC Tokens**:
   - Admin access cookies contain HMAC-SHA256 signed timestamps generated via the Web Crypto API (`src/lib/auth.ts`).
   - Cookies are set with `httpOnly: true`, `secure: true` (in production), and `sameSite: "lax"`.
3. **Password Protection & Rate Limiting**:
   - `/api/auth` verifies the admin password using constant-time SHA-256 byte comparison to prevent timing attacks.
   - Built-in rate limiting locks out IP addresses after 5 failed attempts for 15 minutes.
4. **Isolated Database Credentials**:
   - Client-side code only has access to `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` (read-only queries).
   - Module-load guards in `src/lib/db.ts` fail-closed at startup if `NEXT_PUBLIC_SUPABASE_ANON_KEY` is missing or is detected as a `service_role` JWT.
   - All mutations (`POST`, `PUT`, `DELETE` on `/api/projects`) execute strictly on the server using `SUPABASE_SERVICE_ROLE_KEY` inside `src/lib/db-server.ts`.
   - `src/lib/db-server.ts` uses `import "server-only"` to guarantee compile-time failure if ever imported by a client component.
   - The `SUPABASE_SERVICE_ROLE_KEY` is never prefixed with `NEXT_PUBLIC_` and never bundled into client JavaScript.

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js 18+ (tested on Node.js 20/22/24)
- npm or pnpm

### 2. Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

| Variable | Scope | Description |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Client & Server | Public Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Client & Server | Public anon/publishable key ONLY (never service_role) |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-Only | Supabase service_role key for backend operations (no `NEXT_PUBLIC_`) |
| `ADMIN_ACCESS_PASSWORD` | Server-Only | Admin panel login password (32+ random characters) |
| `ADMIN_ACCESS_TOKEN_SECRET` | Server-Only | Secret for HMAC token signing (32+ random characters) |

### 3. Install Dependencies & Run
```bash
npm install
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) for the public portfolio or [http://localhost:3000/admin](http://localhost:3000/admin) to manage projects.

---

## 🛠️ Available Scripts

- `npm run dev`: Starts the Next.js development server.
- `npm run build`: Compiles production build, lints code, and validates TypeScript types.
- `npm start`: Runs the built production server.
- `npm run lint`: Runs ESLint checks.
