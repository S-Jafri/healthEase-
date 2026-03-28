from app.database import init_db
import app.models

if __name__ == "__main__":
    init_db()
    print("Database tables initialized.")
