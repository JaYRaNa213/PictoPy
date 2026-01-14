import sqlite3
import json
import os

db_path = 'backend/app/database/PictoPy.db'

if not os.path.exists(db_path):
    print(f"Database not found at {db_path}")
    exit(1)

conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# Get some rows to see the structure
cursor.execute('SELECT metadata FROM images WHERE metadata LIKE "%latitude%" LIMIT 5')
rows = cursor.fetchall()

if not rows:
    print("No images with latitude found.")
    # Show another row just to see the structure
    cursor.execute('SELECT metadata FROM images LIMIT 1')
    rows = cursor.fetchall()

for row in rows:
    if row[0]:
        print(row[0])

conn.close()
