# SRI BALAJI SPECIAL MIXTURES – PRODUCTION DEPLOYMENT & DEVOPS GUIDE
**Platform:** FastAPI (Python 3.9+) • React + TypeScript + Vite + Tailwind CSS • SQLite / PostgreSQL

---

## 1. PRODUCTION DEPLOYMENT ARCHITECTURE

```
[ Internet / HTTPS Port 443 ]
          │
          ▼
   [ Nginx / Caddy Reverse Proxy (SSL Termination with Let's Encrypt) ]
          │
    ┌─────┴─────────────────────────────────────┐
    │                                           │
    ▼                                           ▼
[ Frontend: Port 5173 / Static Webroot ]  [ Backend: FastAPI Port 8000 (Uvicorn) ]
                                                │
                                                ▼
                                    [ SQLite / PostgreSQL DB ]
                                                │
                                                ▼
                                    [ Automated Daily Backups ]
```

---

## 2. PRODUCTION ENVIRONMENT CONFIGURATION

### Backend `.env` (`backend/.env`):
```ini
ENVIRONMENT=production
PROJECT_NAME="Sri Balaji Special Mixtures"
API_V1_STR=/api/v1
SECRET_KEY=ChangeThisToAStrong64CharRandomSecretInProduction!
DATABASE_URL=sqlite:///./sribalaji.db

# Admin Superuser Credentials
FIRST_SUPERUSER_EMAIL=admin@sribalaji.com
FIRST_SUPERUSER_PASSWORD=ChangeThisStrongPassword2026!

# Razorpay Live API Credentials
RAZORPAY_KEY_ID=rzp_live_your_actual_key_id
RAZORPAY_KEY_SECRET=your_actual_razorpay_secret
RAZORPAY_WEBHOOK_SECRET=your_actual_webhook_secret

# Business Contact Settings
CONTACT_PHONE=9437135342
WHATSAPP_PHONE=9861789602
BUSINESS_ADDRESS=Gandhi School Road, Near Post Office, Paralakhemundi, Gajapati, Odisha - 761200
```

### Frontend `.env.production` (`frontend/.env.production`):
```ini
VITE_API_BASE_URL=https://api.sribalajispecialmixtures.in/api/v1
VITE_RAZORPAY_KEY_ID=rzp_live_your_actual_key_id
```

---

## 3. PRODUCTION BUILD STEPS

### Frontend Production Build:
```bash
cd frontend
npm ci
npm run build
```
- Output generated in `frontend/dist/`.
- Optimized assets: JavaScript bundle (~785 KB, gzip ~198 KB), CSS bundle (~72 KB, gzip ~13 KB).
- PWA service worker (`sw.js` and `workbox`) generated with offline caching.

### Backend Daemon Execution with Systemd / Supervisor:
```bash
# Example Uvicorn production command with 4 workers:
cd backend
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --workers 4
```

---

## 4. DATABASE BACKUP, INTEGRITY & DISASTER RECOVERY

The platform includes a CLI tool for backup and restoration: `backend/scripts/db_backup_recovery.py`.

### Automated Daily Cron Job (Recommended at 03:00 AM UTC):
```bash
0 3 * * * /usr/bin/python3 /path/to/backend/scripts/db_backup_recovery.py --backup >> /var/log/sribalaji_backup.log 2>&1
```

### Manual Backup:
```bash
python backend/scripts/db_backup_recovery.py --backup
```

### Check Database Integrity:
```bash
python backend/scripts/db_backup_recovery.py --integrity
# Expected output: [INTEGRITY] PRAGMA check: ok | Total Tables: 30
```

### List Available Backups:
```bash
python backend/scripts/db_backup_recovery.py --list
```

### Restore from Backup (Disaster Recovery):
```bash
python backend/scripts/db_backup_recovery.py --restore sribalaji_backup_YYYYMMDD_HHMMSS.db
```

---

## 5. SSL / TLS & REVERSE PROXY CONFIGURATION (NGINX EXAMPLE)

```nginx
server {
    listen 80;
    server_name sribalajispecialmixtures.in www.sribalajispecialmixtures.in;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name sribalajispecialmixtures.in www.sribalajispecialmixtures.in;

    ssl_certificate /etc/letsencrypt/live/sribalajispecialmixtures.in/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/sribalajispecialmixtures.in/privkey.pem;

    # Frontend Single Page App
    location / {
        root /var/www/sribalaji/frontend/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # Backend API Reverse Proxy
    location /api/ {
        proxy_pass http://127.0.0.1:8000/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Static uploads
    location /uploads/ {
        proxy_pass http://127.0.0.1:8000/uploads/;
    }
}
```

---

## 6. ROLLBACK STRATEGY

1. **Frontend Rollback:**
   - Keep previous `dist` folders versioned: `dist_v1`, `dist_v2`.
   - Re-point Nginx symlink to the previous version and reload: `sudo nginx -s reload`.
2. **Backend Rollback:**
   - Revert Git commit: `git checkout <previous_commit_tag>`.
   - If database schema changed, restore database from the pre-migration backup using `db_backup_recovery.py --restore <backup_file>`.
   - Restart backend service.

