# Joseph's Portfolio Website

A modern, professional portfolio website built with Next.js 15, showcasing Joseph Thuo's skills, projects, and professional experience.

## Tech Stack

- **Framework:** Next.js 15 with App Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Shadcn/ui
- **Database:** Supabase (PostgreSQL)
- **Deployment:** Vercel

## Features

- Responsive design for all devices
- Dark/Light mode support
- Project showcase with filtering
- About section with professional summary
- Skills display
- Contact information
- Modern animations and transitions

## Getting Started

### Prerequisites

- Node.js 18+ installed
- pnpm package manager
- Supabase account (for database features)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/josephthuo/joseph-portfolio-website.git
cd joseph-portfolio-website
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` and add your Supabase credentials:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Run the development server:
```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/              # Next.js app router pages
├── components/       # Reusable UI components
├── data/            # Portfolio data and content
├── lib/             # Utility functions and configurations
├── public/          # Static assets
├── styles/          # Global styles
└── types/           # TypeScript type definitions
```

## Database Setup

If using Supabase features, run the SQL setup script:

```bash
psql -f setup-database.sql
```

See `DATABASE_SETUP.md` for detailed instructions.

## Deployment

The site is deployed on Vercel. Automatic deployments occur when pushing to the main branch.

## Author

**Joseph Thuo**
- Full Stack Developer
- 5+ Years of Experience
- Based in Nairobi, Kenya

## License

MIT License - feel free to use this project for your own portfolio.
