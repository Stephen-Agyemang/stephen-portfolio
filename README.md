# Stephen Agyemang — Portfolio

Personal portfolio website built with **React 19** and **Vite 7**, deployed on Vercel.

**Live site:** [stephen-vite.vercel.app](https://stephen-vite.vercel.app)

## Features

- Dual-theme switcher (dark / light)
- Animated Hero section with HUD telemetry bar
- About section with rotating reticle frame
- Projects showcase with per-project color themes and live demo modals
- Interactive force-directed skills graph (desktop) with drag support
- AI-powered Project Discovery chatbot (OpenAI streaming)
- Email Draft Assistant (OpenAI)
- Vercel Analytics

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite 7 |
| Styling | CSS custom properties (no CSS framework) |
| Icons | react-icons, Devicons |
| Fonts | Inter, DM Mono (Google Fonts) |
| AI | OpenAI API (serverless via Vercel Functions) |
| Deployment | Vercel |

## Getting Started

```bash
cd stephen-portfolio
npm install
npm run dev
```

Environment variables required (create `stephen-portfolio/.env.local`):

```
OPENAI_API_KEY=your_key_here
```

## Project Structure

```
stephen-portfolio/
├── api/              # Vercel serverless functions (chat, email, github, linkedin)
├── src/
│   ├── components/   # Navbar, Hero, About, Projects, Skills, EmailDraftAssistant, Footer
│   ├── data/         # projects.js
│   ├── hooks/        # useIsMobile
│   └── services/     # aiService.js (fetch wrappers for /api routes)
└── public/
```

## License

MIT
