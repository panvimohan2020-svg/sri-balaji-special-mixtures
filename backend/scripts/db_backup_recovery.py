import os
import sys
import shutil
import hashlib
import sqlite3
import argparse
from datetime import datetime, timezone

backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from app.core.config import settings

def get_db_path() -> str:
    db_url = settings.DATABASE_URL
    if db_url.startswith("sqlite:///"):
        path = db_url.replace("sqlite:///", "")
    else:
        path = os.path.join(backend_dir, "sribalaji.db")
    return os.path.normpath(path)

def get_backup_dir() -> str:
    bdir = os.path.join(backend_dir, "backups")
    os.makedirs(bdir, exist_ok=True)
    return bdir

def calculate_sha256(filepath: str) -> str:
    hasher = hashlib.sha256()
    with open(filepath, "rb") as f:
        while chunk := f.read(65536):
            hasher.update(chunk)
    return hasher.hexdigest()

def check_integrity(db_path: str) -> bool:
    if not os.path.exists(db_path):
        print(f"[FAIL] Database file not found at {db_path}")
        return False
    
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    cursor.execute("PRAGMA integrity_check;")
    result = cursor.fetchone()[0]
    cursor.execute("SELECT count(*) FROM sqlite_master WHERE type='table';")
    tables_count = cursor.fetchone()[0]
    conn.close()
    
    print(f"[INTEGRITY] PRAGMA check: {result} | Total Tables: {tables_count}")
    return result == "ok"

def create_backup() -> str:
    db_path = get_db_path()
    bdir = get_backup_dir()
    
    if not check_integrity(db_path):
        raise RuntimeError("Database integrity check failed! Aborting backup.")
        
    timestamp = datetime.now(timezone.utc).strftime("%Y%m%d_%H%M%S")
    backup_filename = f"sribalaji_backup_{timestamp}.db"
    backup_path = os.path.join(bdir, backup_filename)
    
    # Use SQLite native backup API for consistent live snapshot without locks
    src_conn = sqlite3.connect(db_path)
    dst_conn = sqlite3.connect(backup_path)
    src_conn.backup(dst_conn)
    dst_conn.close()
    src_conn.close()
    
    checksum = calculate_sha256(backup_path)
    checksum_file = backup_path + ".sha256"
    with open(checksum_file, "w") as f:
        f.write(f"{checksum}  {backup_filename}\n")
        
    size_kb = round(os.path.getsize(backup_path) / 1024, 2)
    print(f"[BACKUP SUCCESS] Created: {backup_filename} ({size_kb} KB)")
    print(f"[CHECKSUM] SHA-256: {checksum}")
    return backup_path

def list_backups():
    bdir = get_backup_dir()
    files = sorted([f for f in os.listdir(bdir) if f.endswith(".db")])
    print(f"\n=== SRI BALAJI DATABASE BACKUPS ({len(files)} total) ===")
    for f in files:
        fpath = os.path.join(bdir, f)
        size_kb = round(os.path.getsize(fpath) / 1024, 2)
        mtime = datetime.fromtimestamp(os.path.getmtime(fpath)).strftime("%Y-%m-%d %H:%M:%S")
        print(f" • {f:<45} | {size_kb:>8} KB | {mtime}")
    print("========================================================\n")

def restore_backup(backup_name_or_path: str):
    bdir = get_backup_dir()
    if os.path.isabs(backup_name_or_path):
        target = backup_name_or_path
    else:
        target = os.path.join(bdir, backup_name_or_path)
        
    if not os.path.exists(target):
        print(f"[ERROR] Target backup file does not exist: {target}")
        sys.exit(1)
        
    # Check SHA256 if .sha256 file exists
    sha_file = target + ".sha256"
    if os.path.exists(sha_file):
        with open(sha_file, "r") as sf:
            expected_sha = sf.read().split()[0]
        actual_sha = calculate_sha256(target)
        if expected_sha != actual_sha:
            print(f"[ERROR] SHA-256 mismatch! Expected {expected_sha}, got {actual_sha}. Corrupt backup!")
            sys.exit(1)
        print("[VERIFIED] SHA-256 checksum matches authentic archive.")
        
    # Take safety snapshot before overwriting
    print("[SAFETY] Creating pre-restore snapshot of current active database...")
    pre_restore_backup = create_backup()
    print(f"[SAFETY] Safe snapshot stored at {pre_restore_backup}")
    
    # Perform restore
    active_db = get_db_path()
    shutil.copy2(target, active_db)
    print(f"[RESTORED] Successfully restored {target} -> {active_db}")
    
    # Verify post-restore integrity
    assert check_integrity(active_db), "Post-restore integrity check failed!"
    print("[READY] Database restored and integrity verified 100% OK.")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Sri Balaji Database Backup & Recovery Utility")
    parser.add_argument("--backup", action="store_true", help="Create verified database snapshot")
    parser.add_argument("--integrity", action="store_true", help="Check active database integrity")
    parser.add_argument("--list", action="store_true", help="List all available backups")
    parser.add_argument("--restore", type=str, help="Restore database from specified backup filename")
    
    args = parser.parse_args()
    if args.backup:
        create_backup()
    elif args.integrity:
        check_integrity(get_db_path())
    elif args.list:
        list_backups()
    elif args.restore:
        restore_backup(args.restore)
    else:
        parser.print_help()
