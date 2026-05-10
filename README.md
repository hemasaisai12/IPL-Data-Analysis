# IPL Analytics Dashboard

A Flask web app that visualises IPL match and delivery data with interactive Chart.js charts.

## Features

- Most successful teams (wins)
- Toss winners
- Top 10 player of the match winners
- Top venues by matches hosted
- Total runs scored by team
- Top 10 batsmen by career runs
- Top 10 bowlers by wickets

## Project structure

```
ipl-dashboard/
├── app.py              # Flask app + API endpoints
├── matches.csv         # ← add your file here
├── deliveries.csv      # ← add your file here
├── requirements.txt
├── Procfile            # for Render
├── templates/
│   └── index.html
└── static/
    ├── css/style.css
    └── js/main.js
```

## Local setup

```bash
# 1. Clone the repo and enter the folder
git clone https://github.com/YOUR_USERNAME/ipl-dashboard.git
cd ipl-dashboard

# 2. Add your CSV files
cp /path/to/matches.csv .
cp /path/to/deliveries.csv .

# 3. Create a virtual environment and install dependencies
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt

# 4. Run locally
python app.py
# Open http://localhost:5000
```

## Deploy to GitHub + Render

### Step 1 — push to GitHub

```bash
git init
git add .
git commit -m "Initial IPL dashboard"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/ipl-dashboard.git
git push -u origin main
```

> **Important:** your CSV files must be committed to the repo so Render can read them.
> If the files are large, consider using Git LFS (`git lfs track "*.csv"`).

### Step 2 — deploy on Render

1. Go to [render.com](https://render.com) and sign in (free tier works).
2. Click **New → Web Service**.
3. Connect your GitHub account and select the `ipl-dashboard` repo.
4. Fill in the settings:

| Field | Value |
|---|---|
| Environment | Python 3 |
| Build command | `pip install -r requirements.txt` |
| Start command | `gunicorn app:app` |

5. Click **Create Web Service**. Render will build and deploy automatically.
6. Your live URL will be something like `https://ipl-dashboard.onrender.com`.

### Re-deploying after changes

Just push to `main` — Render auto-deploys on every push.

```bash
git add .
git commit -m "Update charts"
git push
```
