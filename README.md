# cotneo.com — Personal Portfolio

Personal portfolio of **Furkan Akar — Full-Stack & Mobile Software Developer**.
Live at [cotneo.com](https://cotneo.com).

## Tech stack

- **Framework**: Next.js 15 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS v4 with custom design tokens (dark "engineering blueprint" theme)
- **Fonts**: Inter + JetBrains Mono via `next/font`
- **AI assistant**: OpenAI API with language detection (TR/EN) and fallback responses
- **Data**: Vercel KV for chat rate limiting and caching; GitHub API for live repo stats
- **Deployment**: Vercel

## Architecture

All site content (experience, projects, skills, education) lives in a single typed data
file — updating the site means editing one file:

```
src/
├── data/profile.ts          # single source of truth for all content
├── app/
│   ├── layout.tsx           # SEO metadata + JSON-LD Person schema
│   ├── page.tsx             # section composition
│   └── api/
│       ├── chat/            # AI assistant (OpenAI + fallbacks + rate limiting)
│       └── github/          # live GitHub stats
└── components/
    ├── ui/                  # Reveal (scroll animation), SectionHeading
    ├── Hero.tsx             # terminal-card hero
    ├── Experience.tsx       # timeline
    ├── Skills.tsx           # skill groups with honest proficiency levels
    └── ...                  # About, Projects, Certificates, Contact, Footer
```

Sections animate with a lightweight IntersectionObserver + CSS transition
(`prefers-reduced-motion` respected) — no animation library on the main page,
no WebGL. First Load JS ≈ 171 kB.

The `docs/` folder contains career content sources (CV, LinkedIn, GitHub README,
case-study drafts, SEO notes) that this site's content is derived from.

## Getting started

```bash
npm install
npm run dev
```

Create a `.env.local` with:

```env
OPENAI_API_KEY=...            # chatbot (works with fallbacks if unset)
KV_REST_API_URL=...           # Vercel KV (optional; disables rate limiting if unset)
KV_REST_API_TOKEN=...
GITHUB_TOKEN=...              # raises GitHub API limit from 60 to 5000 req/h
```

## Deployment

Deployed on Vercel; pushes to `main` deploy automatically. Set the environment
variables above in the Vercel dashboard.

## Contact

- Website: [cotneo.com](https://cotneo.com)
- GitHub: [@CotNeo](https://github.com/CotNeo)
- LinkedIn: [furkanaliakar](https://linkedin.com/in/furkanaliakar)

## License

MIT
