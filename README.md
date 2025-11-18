# CycleScope Domain API

Detailed domain-level market analysis API with both long-term and short-term chart analysis.

## Overview

**cyclescope-domain-api** provides detailed domain-level analysis that complements the high-level summary from cyclescope-api's Gamma Assistant.

### Key Features

- **Detailed Analysis:** Indicator-level breakdown for each domain
- **Dual Timeframe:** Both long-term and short-term chart analysis
- **6 Domains:** MACRO, LEADERSHIP, BREADTH, LIQUIDITY, VOLATILITY, SENTIMENT
- **OpenAI Integration:** Uses specialized Domain Analysis Assistant
- **5-Day Retention:** Automatic cleanup of old data
- **HTML Generation:** Creates domain detail pages

## Quick Start

### Prerequisites

- Node.js 22+
- PostgreSQL database
- OpenAI API key with access to Domain Analysis Assistant

### Local Development

```bash
# Install dependencies
npm install

# Set environment variables
cp .env.example .env
# Edit .env with your credentials

# Start development server
npm run dev
```

Server runs on http://localhost:3000

### API Endpoints

- **GET /health** - Health check
- **GET /api/trpc/health** - tRPC health check
- **POST /api/trpc/domain.analyze** - Analyze domain (not yet implemented)
- **GET /api/trpc/domain.latest** - Get latest domain analysis (not yet implemented)

## Project Status

- ✅ Phase 1: Project Setup (COMPLETE)
- ⏳ Phase 2: Database Schema (TODO)
- ⏳ Phase 3: Domain Configuration (TODO)
- ⏳ Phase 4: OpenAI Integration (TODO)
- ⏳ Phase 5: JSON Parser (TODO)
- ⏳ Phase 6: API Endpoints (TODO)
- ⏳ Phase 7: HTML Generation (TODO)
- ⏳ Phase 8: Deploy to Railway (TODO)
- ⏳ Phase 9: Update Portal (TODO)
- ⏳ Phase 10: Testing & Documentation (TODO)

## Tech Stack

- **Runtime:** Node.js 22
- **Language:** TypeScript
- **Framework:** Express 4
- **API:** tRPC 11
- **Database:** PostgreSQL
- **ORM:** Drizzle ORM
- **AI:** OpenAI Assistants API
- **Deployment:** Railway (Docker)

## Project Structure

```
cyclescope-domain-api/
├── server/
│   ├── index.ts                      # Express + tRPC server entry
│   ├── routers.ts                    # API endpoints
│   ├── db.ts                         # Database operations
│   ├── trpc.ts                       # tRPC setup
│   ├── assistants/
│   │   └── domainAnalysis.ts         # OpenAI integration
│   ├── parsers/
│   │   └── domainParser.ts           # JSON validation
│   ├── generators/
│   │   └── htmlGenerator.ts          # HTML generation
│   └── types/
│       └── domain.ts                 # TypeScript types
├── drizzle/
│   ├── schema.ts                     # Database schema
│   └── migrations/                   # Auto-generated migrations
├── shared/
│   └── domainConfig.ts               # Domain configurations
├── public/
│   └── domains/                      # Generated HTML pages
├── .env.example                      # Environment variables template
├── package.json                      # Dependencies
├── tsconfig.json                     # TypeScript config
└── README.md                         # This file
```

## Development

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm run db:push` - Push database schema changes
- `npm run db:studio` - Open Drizzle Studio (database GUI)

### Environment Variables

See `.env.example` for required environment variables.

## Integration with CycleScope

### cyclescope-api (Main API)

- **Purpose:** High-level cycle-aware analysis
- **Data:** Gamma (summary) + Delta + Fusion
- **Use Case:** Main dashboard

### cyclescope-domain-api (This Service)

- **Purpose:** Detailed domain-level analysis
- **Data:** Indicator-level breakdown (long-term + short-term)
- **Use Case:** Domain detail pages

### cyclescope-portal (Frontend)

- **Main Dashboard:** Calls cyclescope-api
- **Domain Detail Pages:** Calls cyclescope-domain-api

## License

ISC

## Author

CycleScope Team

