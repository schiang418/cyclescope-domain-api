# CycleScope Domain API

Microservice for generating detailed domain analysis using OpenAI Assistants.

---

## 🏗️ Architecture

This is a standalone microservice that:
- Analyzes 6 market domains (Macro, Leadership, Breadth, Liquidity, Volatility, Sentiment)
- Uses OpenAI Assistant API with chart image analysis
- Stores analysis results in PostgreSQL database
- Provides tRPC API endpoints for cyclescope-api integration

**3-Service Architecture:**
```
cyclescope-portal (Frontend)
    ↓
cyclescope-api (Orchestrator + Cron)
    ↓
cyclescope-domain-api (Domain Analysis) ← This service
```

---

## 🚀 Quick Start

### **Prerequisites**
- Node.js 22+
- PostgreSQL database
- OpenAI API key
- OpenAI Assistant ID

### **Installation**
```bash
npm install
```

### **Environment Variables**
```bash
DATABASE_URL=postgresql://user:pass@host:5432/dbname
OPENAI_API_KEY=sk-proj-YOUR_KEY_HERE
OPENAI_ASSISTANT_ID=asst_YOUR_ASSISTANT_ID
PORT=3000
NODE_ENV=production
```

### **Database Setup**
```bash
# Create table
npm run db:push

# Or manually run SQL
psql $DATABASE_URL < create_table.sql
```

### **Run Development Server**
```bash
npm run dev
```

### **Run Production Server**
```bash
npm run build
npm start
```

---

## 📊 API Endpoints

### **Health Check**
```
GET /health
```

### **tRPC Endpoints**
```
POST /api/trpc/domain.analyze
POST /api/trpc/domain.latest
POST /api/trpc/domain.all
POST /api/trpc/domain.history
```

---

## 🚢 Railway Deployment

### **Step 1: Create Railway Project**
1. Go to [Railway.app](https://railway.app)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose `schiang418/cyclescope-domain-api`

### **Step 2: Set Environment Variables**
In Railway dashboard → Variables:
```
DATABASE_URL=postgresql://postgres:PASSWORD@postgres.railway.internal:5432/railway
OPENAI_API_KEY=sk-proj-YOUR_OPENAI_API_KEY_HERE
OPENAI_ASSISTANT_ID=asst_yV08iHKU0cx8V7kt9qdYzeSs
PORT=3000
NODE_ENV=production
```

**Important:** Use Railway's **Private Network URL** for DATABASE_URL:
- ✅ `postgres.railway.internal` (private, faster, free)
- ❌ `maglev.proxy.rlwy.net` (public, slower, costs egress)

### **Step 3: Deploy**
Railway will automatically:
1. Detect Node.js project
2. Run `npm install`
3. Run `npm run build`
4. Start server with `npm start`

### **Step 4: Test**
```bash
# Health check
curl https://your-app.railway.app/health

# tRPC health
curl https://your-app.railway.app/api/trpc/health
```

---

## 🗄️ Database Schema

**Table:** `domain_analyses`

| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL | Primary key |
| date | DATE | Analysis date |
| dimension_code | VARCHAR(50) | Domain code (MACRO, LEADERSHIP, etc.) |
| analysis_json | JSONB | Full OpenAI response |
| created_at | TIMESTAMP | Record creation time |
| updated_at | TIMESTAMP | Last update time |

**Unique Constraint:** `(date, dimension_code)`

---

## 📁 Project Structure

```
cyclescope-domain-api/
├── server/
│   ├── assistants/
│   │   └── domainAnalysis.ts    # OpenAI Assistant integration
│   ├── types/
│   │   └── domain.ts             # TypeScript types
│   ├── db.ts                     # Database operations
│   ├── routers.ts                # tRPC routers
│   └── index.ts                  # Express server
├── drizzle/
│   └── schema.ts                 # Database schema
├── shared/
│   └── domainConfig.ts           # Domain configurations
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🔧 Development

### **Run Tests**
```bash
# Test database connection
npm run test:db

# Test OpenAI Assistant
npm run test:assistant

# Test environment variables
npm run test:env
```

### **Database Migrations**
```bash
# Generate migration
npm run db:generate

# Push schema to database
npm run db:push

# Open Drizzle Studio
npm run db:studio
```

---

## 📝 Domain Configuration

**6 Domains:**
1. **MACRO** - Secular Trend, Cyclical Trend, Intermediate Trend
2. **LEADERSHIP** - Sector Leadership, Factor Leadership
3. **BREADTH** - Advance-Decline, New Highs-Lows, Participation
4. **LIQUIDITY** - Credit Spreads, Yield Curve, Fed Policy
5. **VOLATILITY** - VIX, Put/Call Ratio, Skew
6. **SENTIMENT** - Bull/Bear Ratio, AAII Survey, CNN Fear & Greed

**19 Indicators Total**

Each indicator has:
- Long-term chart URL (StockCharts.co)
- Short-term chart URL (StockCharts.co)
- Display name
- Category

---

## 🤖 OpenAI Assistant Configuration

**Assistant ID:** `asst_yV08iHKU0cx8V7kt9qdYzeSs`

**Capabilities:**
- Image analysis (chart screenshots)
- JSON response format
- Multi-turn conversation (for batch chart analysis)

**Analysis Flow:**
1. Create thread
2. Send long-term charts (batch 1)
3. Send short-term charts (batch 2)
4. Run assistant
5. Poll for completion
6. Parse JSON response

---

## 📊 Integration with cyclescope-api

**cyclescope-api** will call this service during cron job:

```typescript
// In cyclescope-api cron job
const response = await fetch('https://domain-api.railway.app/api/trpc/domain.analyze', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    dimensionCode: 'MACRO',
    asOfDate: '2025-11-19'
  })
});

const analysis = await response.json();
// Store in daily_snapshots table
```

---

## 🐛 Troubleshooting

### **Database Connection Error**
- Check `DATABASE_URL` format
- Ensure Railway PostgreSQL service is running
- Use private network URL (`postgres.railway.internal`)

### **OpenAI API Error**
- Verify `OPENAI_API_KEY` is set correctly
- Check Assistant ID exists
- Ensure API key has sufficient credits

### **Build Error**
- Clear Railway build cache
- Check Node.js version (requires 22+)
- Verify all dependencies are in `package.json`

---

## 📚 Documentation

- [Architecture Document](./CycleScope-Domain-API-Architecture.md)
- [Phase 1 Complete](./PHASE1_COMPLETE.md)
- [Phase 2 Complete](./PHASE2_COMPLETE.md)
- [Phase 3 Complete](./PHASE3_COMPLETE.md)
- [Phase 4 Complete](./PHASE4_COMPLETE.md)

---

## 📝 Project Status

- ✅ **Phase 1:** Project Setup (COMPLETE)
- ✅ **Phase 2:** Database Schema (COMPLETE)
- ✅ **Phase 3:** Domain Configuration (COMPLETE)
- ✅ **Phase 4:** OpenAI Integration (COMPLETE)
- ✅ **Phase 5:** JSON Parser (COMPLETE - included in Phase 4)
- ✅ **Phase 6:** API Endpoints (COMPLETE - included in Phase 4)
- ⏭️ **Phase 7:** HTML Generation (SKIPPED - focus on API first)
- 🚀 **Phase 8:** Deploy to Railway (IN PROGRESS)
- ⏳ **Phase 9:** Update Portal (TODO)
- ⏳ **Phase 10:** Testing & Documentation (TODO)

---

## 📄 License

MIT

---

## 👥 Contributors

- schiang418

---

**Status:** ✅ Phases 1-6 Complete, Ready for Railway Deployment

