# CricTac

A fast, modern cricket quiz game that blends IPL trivia with Tic Tac Toe. Play offline on one device or online with friends.

## Features
- Country  IPL and IPL  IPL modes (valid pairings only)
- Multiplayer: offline hot-seat and online rooms
- Fair rotation of teams and countries
- Clean UI, mobile-friendly, keyboard accessible
- SEO-ready (Open Graph, Twitter, sitemap, robots, manifest)

## Tech
- Next.js + React + TypeScript
- Tailwind CSS
- Firebase (Auth/Firestore) for online rooms

## Quick Start
`
# install
npm ci
# dev
npm run dev
# build
npm run build && npm start
`

## Gameplay
- Pick a mode and start a 33 board.
- Click a cell to answer a player question.
- Correct answer marks your symbol; three in a row wins.
- Play Again starts a new round with the same matchup; Reset re-rolls options.

## Online Rooms
- Create a room and share the Room ID.
- Second player joins to start the match.
- Real-time updates with conflict handling and retry logic.

## Deploy
- Set your production URL in metadataBase in src/app/layout.tsx.
- Add environment variables for Firebase in .env.local (not committed).

---
 2025 CricTac
