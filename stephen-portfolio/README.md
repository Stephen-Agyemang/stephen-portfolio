# stephen-portfolio

React + Vite frontend for [stephens-portfolio.vercel.app](https://stephens-portfolio.vercel.app).

## Dev

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build → dist/
npm run preview  # preview production build locally
```

## Environment variables

Create a `.env.local` file in this directory:

```
OPENAI_API_KEY=your_key_here
```

## API routes (Vercel Functions)

| Route | Purpose |
|---|---|
| `/api/chat` | Streaming AI chatbot (project discovery) |
| `/api/email` | Email draft generation |
| `/api/githubFetcher` | GitHub stats proxy |
| `/api/linkedinProfile` | LinkedIn profile proxy |

## Build output

Chunks are split for optimal caching:

- `index.js` — Navbar + Hero (critical path, loads immediately)
- `vendor-react.js` — React + ReactDOM (cached between deploys)
- `vendor-icons.js` — react-icons (cached between deploys)
- All other sections (About, Projects, Skills, etc.) — lazy-loaded on scroll
