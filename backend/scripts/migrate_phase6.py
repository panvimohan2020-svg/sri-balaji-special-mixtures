import os
import sys
import shutil
import sqlite3
from datetime import datetime, timezone

# Ensure backend root is in sys.path
backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from app.core.config import settings
from app.core.database import Base, engine
import app.models  # Ensures all models are registered in metadata


def run_migration():
    print("=== STARTING PHASE 6 COMMERCIAL LAUNCH MIGRATION ===")
    
    # Extract actual sqlite path from DATABASE_URL
    db_url = settings.DATABASE_URL
    if db_url.startswith("sqlite:///"):
        db_path = db_url.replace("sqlite:///", "")
    else:
        db_path = os.path.join(backend_dir, "sribalaji.db")
    
    db_path = os.path.normpath(db_path)
    backup_dir = os.path.join(backend_dir, "backups")
    os.makedirs(backup_dir, exist_ok=True)
    
    timestamp = datetime.now(timezone.utc).strftime("%Y%m%d_%H%M%S")
    backup_file = os.path.join(backup_dir, f"sribalaji_backup_phase6_pre_{timestamp}.db")
    
    if os.path.exists(db_path):
        shutil.copy2(db_path, backup_file)
        print(f"[OK] Safety backup created: {backup_file}")
    else:
        print(f"[WARN] SQLite DB file at {db_path} does not exist yet; will be created.")

    # 2. Create tables via SQLAlchemy metadata
    Base.metadata.create_all(bind=engine)
    print("[OK] Base.metadata.create_all() executed.")

    # 3. Direct SQLite Schema Verification
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
    tables = [row[0] for row in cursor.fetchall()]
    print(f"[OK] Discovered {len(tables)} tables in database.")
    
    assert "customer_feedback" in tables, "Table customer_feedback missing!"
    assert "marketing_events" in tables, "Table marketing_events missing!"
    
    # Integrity Check
    cursor.execute("PRAGMA integrity_check;")
    check = cursor.fetchone()
    print(f"[OK] PRAGMA integrity_check: {check[0]}")
    assert check[0] == "ok", f"Integrity check failed: {check}"
    
    conn.close()
    print("=== PHASE 6 MIGRATION COMPLETED SUCCESSFULLY! ===")


if __name__ == "__main__":
    run_migration()
