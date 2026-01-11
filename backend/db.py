# backend/database.py
import os
from dotenv import load_dotenv
from pymongo import MongoClient

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise ValueError("DATABASE_URL is not set in .env file!")

# Connect to MongoDB
client = MongoClient(DATABASE_URL)
db = client.get_database()  # default DB from URL
quiz_collection = db.quizzes  # MongoDB collection for quizzes

# No SQLAlchemy models needed anymore, keep Pydantic models in main.py
