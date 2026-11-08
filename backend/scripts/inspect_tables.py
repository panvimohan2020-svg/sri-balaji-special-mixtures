import sqlite3

conn = sqlite3.connect('backend/sribalaji.db')
cursor = conn.cursor()
cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
tables = [r[0] for r in cursor.fetchall()]
print(f"Total tables: {len(tables)}")
print("Tables:", sorted(tables))
conn.close()

