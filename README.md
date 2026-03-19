# Couples Connect

A calm, focused chat application for couples with a unique **Fight Mode** feature.

## Features

- **WebAuthn Authentication** - Device fingerprint/Touch ID/Face ID, no passwords
- **6-digit Code Pairing** - Simple way to connect with your partner
- **Real-time Chat** - Instant messaging with Socket.io
- **Fight Mode** - Take a calming break with AI-generated quotes
- **Mood Check-ins** - Daily emotional check-ins
- **Virtual Hugs** - Send animated hugs (works even during Fight Mode)
- **Song Sharing** - Share songs from YouTube, Spotify, SoundCloud
- **Daily Question** - AI-powered conversation starters

## Tech Stack

- **Frontend**: React + Vite + TailwindCSS
- **Backend**: Node.js + Express + Socket.io
- **Database**: MongoDB
- **AI**: OpenAI GPT-4

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- OpenAI API key (optional, for AI quotes)

### Installation

```bash
# Install dependencies
cd CouplesConnect
npm install
cd client && npm install
cd ../server && npm install
```

### Configuration

Create a `.env` file in the server directory:

```env
PORT=3001
MONGODB_URI=mongodb://localhost:27017/couplesconnect
CLIENT_URL=http://localhost:5173
OPENAI_API_KEY=your_openai_api_key_here
```

### Running

```bash
# Run both client and server
npm run dev

# Or run separately
npm run client  # Frontend on http://localhost:5173
npm run server # Backend on http://localhost:3001
```

## Project Structure

```
CouplesConnect/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/      # UI components
│   │   ├── context/        # React contexts (Auth, Socket)
│   │   ├── pages/          # Page components
│   │   └── App.jsx         # Main app with routing
│   └── vite.config.js      # Vite configuration
│
├── server/                 # Express backend
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── services/          # Business logic (quoteService)
│   ├── socket/            # Socket.io handlers
│   └── index.js           # Server entry point
│
└── package.json           # Root package.json
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register WebAuthn device |
| POST | `/api/auth/authenticate` | Authenticate device |
| POST | `/api/couples/create` | Create couple pairing |
| POST | `/api/couples/join` | Join with 6-digit code |
| GET | `/api/messages/:coupleId` | Fetch messages |
| POST | `/api/quotes/generate` | Get AI quote |
| POST | `/api/mood` | Submit mood check-in |

## Fight Mode

When enabled:
- Chat input is disabled for both partners
- Full-screen calming UI with animated background
- AI generates contextual calming quotes
- Countdown timer shows remaining time
- Virtual hugs still work
- Emergency override available

## Design

- Warm, cozy color palette (blush, sage, cream)
- Minimalist, distraction-free interface
- Subtle animations for a calming experience
- No ads, no algorithmic feeds, no like counts
