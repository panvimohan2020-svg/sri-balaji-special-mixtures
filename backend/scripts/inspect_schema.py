import sqlite3

con = sqlite3.connect('backend/sribalaji.db')
cursor = con.cursor()
cursor.execute("SELECT name, sql FROM sqlite_master WHERE type='table';")
for name, sql in cursor.fetchall():
    print(f"=== TABLE: {name} ===")
    print(sql)
con.close()
