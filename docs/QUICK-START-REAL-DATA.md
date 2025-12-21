# 🚀 Quick Start: Get Real NJIT Classroom Data

## Simple 3-Step Setup

### Step 1: Create credentials file
```bash
cp .env.example .env
```

### Step 2: Add your NJIT login
Edit `.env` and add:
```
NJIT_USERNAME=your_ucid
NJIT_PASSWORD=your_password
```

### Step 3: Restart server
```bash
npm start
```

**That's it!** 🎉 Your backend now has real NJIT classroom data!

---

## Without Providing Credentials?

**Option A: Use Sample Data** (current)
- Just run `npm start`
- Works with 27 fake courses for testing

**Option B: Manual CSV Upload**
1. Get course schedule from NJIT
2. Create a CSV file with course data
3. Upload it:
```bash
curl -X POST http://localhost:3000/api/import/csv \
  -H "Content-Type: text/csv" \
  --data-binary @courses.csv
```

---

## Verify It's Working

Check your API:
```bash
curl http://localhost:3000/api/health
```

Should show `coursesLoaded: 1000+` instead of 27!

---

## Need Puppeteer?

If you want **fully automated** scraping:
```bash
npm install puppeteer
```

Without Puppeteer, you can still use:
- CSV upload (manual but works great)
- Sample data (for development)

---

## 🔒 Is This Safe?

**YES!** Your credentials:
- ✅ Stay on YOUR computer only (in `.env`)
- ✅ Are NEVER sent anywhere else
- ✅ Are NOT logged or saved
- ✅ Can be removed anytime

The `.env` file is in `.gitignore` so it won't be committed.

---

## 📚 Full Documentation

See [`docs/REAL-DATA-SETUP.md`](docs/REAL-DATA-SETUP.md) for:
- Detailed setup instructions
- Troubleshooting guide
- Alternative methods
- Security information

---

**Questions?** Check the logs: `tail -f logs/app.log`
