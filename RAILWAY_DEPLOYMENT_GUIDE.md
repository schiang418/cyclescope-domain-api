# Railway Deployment Guide

Complete guide for deploying cyclescope-domain-api to Railway.

---

## 📋 Prerequisites

Before deploying, ensure you have:

1. ✅ GitHub repository: `schiang418/cyclescope-domain-api`
2. ✅ Railway account: [railway.app](https://railway.app)
3. ✅ OpenAI API key with credits
4. ✅ OpenAI Assistant ID: `asst_yV08iHKU0cx8V7kt9qdYzeSs`
5. ✅ Railway PostgreSQL database (same as cyclescope-api)

---

## 🚀 Deployment Steps

### **Step 1: Create New Railway Service**

1. Go to your Railway project dashboard
2. Click **"+ New"** button
3. Select **"GitHub Repo"**
4. Choose `schiang418/cyclescope-domain-api`
5. Railway will automatically detect Node.js and start building

---

### **Step 2: Configure Environment Variables**

In Railway dashboard → Service Settings → Variables, add:

```bash
# Database (use existing Railway PostgreSQL private URL)
DATABASE_URL=postgresql://postgres:PASSWORD@postgres.railway.internal:5432/railway

# OpenAI Configuration
OPENAI_API_KEY=sk-proj-YOUR_ACTUAL_OPENAI_API_KEY_HERE
OPENAI_ASSISTANT_ID=asst_yV08iHKU0cx8V7kt9qdYzeSs

# Server Configuration
PORT=3000
NODE_ENV=production
```

**Important Notes:**

- **DATABASE_URL:** Use the **Private Network URL** from your existing PostgreSQL service
  - Format: `postgresql://postgres:PASSWORD@postgres.railway.internal:5432/railway`
  - Find it in: PostgreSQL service → Variables → `DATABASE_PRIVATE_URL`
  - ✅ Private URL is free and faster
  - ❌ Public URL costs egress fees

- **OPENAI_API_KEY:** Your actual OpenAI API key (starts with `sk-proj-`)
  - Get from: [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
  - Ensure it has sufficient credits

- **OPENAI_ASSISTANT_ID:** Already created, use `asst_yV08iHKU0cx8V7kt9qdYzeSs`

---

### **Step 3: Verify Build**

Railway will automatically:

1. ✅ Install dependencies: `npm install`
2. ✅ Build TypeScript: `npm run build`
3. ✅ Start server: `npm start`

**Check Build Logs:**
- Click on the service
- Go to "Deployments" tab
- Click latest deployment
- View build logs

**Expected Output:**
```
[INFO] Installing dependencies...
[INFO] Building TypeScript...
[INFO] Build complete
[INFO] Starting server...
[INFO] Server running on port 3000
```

---

### **Step 4: Generate Public Domain**

1. In Railway service settings
2. Go to **"Settings"** tab
3. Scroll to **"Networking"** section
4. Click **"Generate Domain"**
5. Copy the generated URL (e.g., `https://cyclescope-domain-api-production.up.railway.app`)

---

### **Step 5: Test Deployment**

#### **Test 1: Health Check**
```bash
curl https://your-app.railway.app/health
```

**Expected Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-11-19T00:00:00.000Z"
}
```

#### **Test 2: tRPC Health**
```bash
curl https://your-app.railway.app/api/trpc/health
```

**Expected Response:**
```json
{
  "result": {
    "data": {
      "status": "ok",
      "timestamp": "2025-11-19T00:00:00.000Z"
    }
  }
}
```

#### **Test 3: Database Connection**
```bash
curl -X POST https://your-app.railway.app/api/trpc/domain.all \
  -H "Content-Type: application/json"
```

**Expected Response:**
```json
{
  "result": {
    "data": []
  }
}
```

---

### **Step 6: Initialize Database Table**

The `domain_analyses` table should already exist from Phase 2. Verify:

```bash
# Connect to Railway PostgreSQL
railway connect postgres

# Check table exists
\dt domain_analyses

# Check schema
\d domain_analyses
```

**If table doesn't exist:**
```sql
-- Run create_table.sql
CREATE TABLE IF NOT EXISTS domain_analyses (
  id SERIAL PRIMARY KEY,
  date DATE NOT NULL,
  dimension_code VARCHAR(50) NOT NULL,
  analysis_json JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(date, dimension_code)
);

CREATE INDEX idx_domain_analyses_date ON domain_analyses(date);
CREATE INDEX idx_domain_analyses_dimension ON domain_analyses(dimension_code);
```

---

## 🔍 Troubleshooting

### **Build Failed**

**Error:** `npm install` fails

**Solution:**
1. Check `package.json` is committed
2. Clear Railway build cache:
   - Settings → Danger Zone → Clear Build Cache
3. Trigger new deployment

---

### **Server Won't Start**

**Error:** `Error: Cannot find module 'express'`

**Solution:**
1. Verify `npm run build` completed successfully
2. Check `dist/` folder exists in build logs
3. Ensure `start` script in `package.json` is correct:
   ```json
   "start": "node dist/server/index.js"
   ```

---

### **Database Connection Error**

**Error:** `Error: connect ECONNREFUSED`

**Solution:**
1. Verify `DATABASE_URL` is set correctly
2. Use **Private Network URL** (`postgres.railway.internal`)
3. Check PostgreSQL service is running
4. Ensure both services are in the same Railway project

---

### **OpenAI API Error**

**Error:** `Error: Invalid API key`

**Solution:**
1. Verify `OPENAI_API_KEY` is set correctly (starts with `sk-proj-`)
2. Check API key has sufficient credits
3. Ensure no extra spaces in environment variable
4. Test API key locally:
   ```bash
   curl https://api.openai.com/v1/models \
     -H "Authorization: Bearer YOUR_API_KEY"
   ```

---

### **Assistant Not Found**

**Error:** `Error: No assistant found with id 'asst_...'`

**Solution:**
1. Verify `OPENAI_ASSISTANT_ID` is correct
2. Check Assistant exists in OpenAI dashboard
3. Ensure API key has access to the Assistant

---

## 📊 Monitoring

### **View Logs**

1. Railway dashboard → Service
2. Click "Deployments" tab
3. Click latest deployment
4. View real-time logs

### **Check Metrics**

1. Railway dashboard → Service
2. Click "Metrics" tab
3. View:
   - CPU usage
   - Memory usage
   - Network traffic
   - Request count

---

## 🔄 Continuous Deployment

Railway automatically redeploys when you push to GitHub:

```bash
# Make changes
git add .
git commit -m "Update feature"
git push origin main

# Railway will automatically:
# 1. Detect push
# 2. Build new version
# 3. Deploy if build succeeds
# 4. Keep old version running until new one is ready
```

---

## 🔐 Security Best Practices

1. ✅ Use Railway's **Private Network** for database connections
2. ✅ Store sensitive data in Railway **Environment Variables**
3. ✅ Never commit `.env` files to GitHub
4. ✅ Use `.gitignore` to exclude sensitive files
5. ✅ Rotate API keys regularly
6. ✅ Enable Railway's **IP Allowlist** if needed

---

## 💰 Cost Optimization

1. **Use Private Network URLs**
   - Free internal traffic
   - Faster connections
   - No egress fees

2. **Monitor Resource Usage**
   - Check CPU/Memory metrics
   - Optimize database queries
   - Use connection pooling

3. **Set Resource Limits**
   - Settings → Resources
   - Set appropriate CPU/Memory limits
   - Prevent unexpected costs

---

## ✅ Deployment Checklist

- [ ] GitHub repo created and pushed
- [ ] Railway service created
- [ ] Environment variables set
- [ ] Build completed successfully
- [ ] Public domain generated
- [ ] Health check passes
- [ ] tRPC health check passes
- [ ] Database connection verified
- [ ] OpenAI Assistant accessible
- [ ] Logs show no errors
- [ ] Metrics look normal

---

## 📞 Support

If you encounter issues:

1. Check Railway build logs
2. Review environment variables
3. Test API endpoints
4. Check database connection
5. Verify OpenAI API key

---

**Next Steps:**
1. Deploy to Railway ✅
2. Test all endpoints
3. Integrate with cyclescope-api
4. Update cyclescope-portal

---

**Deployment Status:** 🚀 Ready to Deploy!

