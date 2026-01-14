import sqlite3
import json
import os

db_path = 'backend/app/database/PictoPy.db'

if not os.path.exists(db_path):
    print(f"Database not found at {db_path}")
    exit(1)

conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# Search path and metadata
search_term = '%Hawa%'
cursor.execute('SELECT path, metadata FROM images WHERE path LIKE ? OR metadata LIKE ?', (search_term, search_term))
rows = cursor.fetchall()

if not rows:
    print("No images matching 'Hawa' found.")
else:
    for path, metadata in rows:
        print(f"Path: {path}")
        print(f"Metadata: {metadata}")
        print("-" * 20)

conn.close()
