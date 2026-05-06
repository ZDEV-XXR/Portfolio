🚀 Hamza's Modern Portfolio
A premium, minimalist developer portfolio built with Next.js 14, Tailwind CSS, and Framer Motion. This project features a sophisticated "floating card" aesthetic, a 3-column responsive grid, and a fully functional dark/light mode ecosystem.

✨ Key Features
Premium UI/UX: Inspired by high-end developer portfolios with a focus on white space, bold typography, and smooth transitions.

Dynamic Dark Mode: A sophisticated dark theme implementation using next-themes and a custom Floating Action Button (FAB).

Responsive Project Grid: A 3-column layout that adapts perfectly from mobile phones to ultra-wide monitors.

Optimized Image Handling: Custom-engineered ProjectCard components that handle various image aspect ratios using object-contain.

Polished Animations: Subtle entry and hover animations powered by Framer Motion for a "living" interface feel.

🛠️ Tech Stack
Framework: Next.js 14 (App Router)

Styling: Tailwind CSS

Icons: Lucide React & Custom SVGs

Theme Management: Next Themes

Animations: Framer Motion

📂 Project Structure
Plaintext
src/
├── app/
│   ├── layout.tsx      # Global providers & Floating Theme Toggle
│   └── page.tsx        # Main landing page with Hero & Projects
├── components/
│   ├── Navbar.tsx      # Minimalist navigation & Social links
│   ├── ProjectCard.tsx # Reusable project display component
│   ├── TechBadge.tsx   # Stylized tech stack tags
│   ├── ThemeProvider.tsx # Theme context wrapper
│   └── ThemeToggle.tsx # Floating Action Button for theme switching
├── data/
│   └── projects.ts     # Centralized project data
└── styles/
    └── globals.css     # Global CSS and Tailwind directives
🚀 Getting Started
Clone the repository

Bash
git clone https://github.com/ZDEV-XXR/Portfolio.git
Install dependencies

Bash
npm install
Run the development server

Bash
npm run dev
Build for production

Bash
npm run build
🎨 Design Decisions
The "H" Logo: A minimalist, bold brand identity that works in both light and dark backgrounds.

Grid System: Used lg:grid-cols-3 to balance the visual weight of the cards against the hero text.

Floating Toggle: Placed the theme switch in the bottom-right corner to maintain a clean Navbar and prioritize "thumb-friendly" mobile interaction.

Developed with ❤️ by Hamza Lemghari
