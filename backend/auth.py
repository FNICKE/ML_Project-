import sqlite3
import os
import jwt
from datetime import datetime, timedelta, timezone
from werkzeug.security import generate_password_hash, check_password_hash
import logging

log = logging.getLogger(__name__)

DB_PATH = os.path.join(os.path.dirname(__file__), "users.db")
SECRET_KEY = os.environ.get("JWT_SECRET", "disaster-prediction-super-secret-key-12345")
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_HOURS = 24

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    try:
        conn = get_db_connection()
        c = conn.cursor()
        c.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        conn.commit()
    except Exception as e:
        log.error(f"Error initializing DB: {e}")
    finally:
        conn.close()

def register_user(username, password):
    try:
        conn = get_db_connection()
        c = conn.cursor()
        c.execute('SELECT id FROM users WHERE username = ?', (username,))
        if c.fetchone():
            return False, "Username already exists"
        
        password_hash = generate_password_hash(password)
        c.execute('INSERT INTO users (username, password_hash) VALUES (?, ?)', (username, password_hash))
        conn.commit()
        return True, "User registered successfully"
    except Exception as e:
        return False, str(e)
    finally:
        conn.close()

def login_user(username, password):
    try:
        conn = get_db_connection()
        c = conn.cursor()
        c.execute('SELECT id, password_hash FROM users WHERE username = ?', (username,))
        user_row = c.fetchone()
        
        if not user_row:
            return False, "Invalid username or password", None
            
        if not check_password_hash(user_row['password_hash'], password):
            return False, "Invalid username or password", None
            
        payload = {
            "sub": user_row['id'],
            "username": username,
            "exp": datetime.now(timezone.utc) + timedelta(hours=JWT_EXPIRATION_HOURS)
        }
        token = jwt.encode(payload, SECRET_KEY, algorithm=JWT_ALGORITHM)
        return True, "Login successful", token
    except Exception as e:
        return False, str(e), None
    finally:
        conn.close()
