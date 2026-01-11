# backend/main.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, HttpUrl
from typing import Dict, Any
from bson import ObjectId
from dotenv import load_dotenv
from scraper import scrape_wikipedia
from llm_quiz_generator import create_quiz_from_article
from db import quiz_collection  # MongoDB collection

load_dotenv()

app = FastAPI(title="AI WikiQuiz Generator - Backend")

# -----------------------
# CORS CONFIG
# -----------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["ai-wiki-quiz-gen.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------
# Pydantic Models
# -----------------------
class GenerateRequest(BaseModel):
    url: HttpUrl

class GenerateResponse(BaseModel):
    quiz_id: str  # MongoDB ObjectId as string
    url: HttpUrl
    title: str
    quiz: Dict[str, Any]

# -----------------------
# ROOT / TEST ENDPOINT
# -----------------------
@app.get("/", status_code=200)
def read_root():
    return {"message": "Backend is running successfully!"}

# -----------------------
# TEST SCRAPER
# -----------------------
@app.get("/test-scrape", status_code=200)
def test_scraper(url: str):
    try:
        title, content = scrape_wikipedia(url)
        return {"title": title, "content_preview": content[:500] + "..."}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

# -----------------------
# TEST SAVE
# -----------------------
@app.post("/test-save", status_code=201)
def save_test_quiz():
    sample_data = {"summary": "This is a sample quiz.", "questions": []}
    quiz_record = {
        "url": "https://example.com",
        "title": "Sample Quiz",
        "scraped_content": "Sample scraped content",
        "full_quiz_data": sample_data
    }
    result = quiz_collection.insert_one(quiz_record)
    return {"message": "Sample quiz saved!", "quiz_id": str(result.inserted_id)}

# -----------------------
# REAL QUIZ GENERATOR
# -----------------------
@app.post("/generate", response_model=GenerateResponse, status_code=201)
def generate_quiz(request: GenerateRequest):
    url = str(request.url)

    # SCRAPE
    try:
        title, cleaned_text = scrape_wikipedia(url)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Scraper error: {e}")

    if not cleaned_text or len(cleaned_text.strip()) < 50:
        raise HTTPException(status_code=422, detail="Article content is too short.")

    # GENERATE QUIZ
    try:
        quiz_data = create_quiz_from_article(article_title=title, article_text=cleaned_text)
        print(quiz_data)
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"LLM error: {e}")

    # SAVE TO MONGO
    quiz_record = {
        "url": url,
        "title": quiz_data.get("title", title),
        "scraped_content": cleaned_text,
        "full_quiz_data": quiz_data
    }
    result = quiz_collection.insert_one(quiz_record)

    return GenerateResponse(
        quiz_id=str(result.inserted_id),
        url=url,
        title=quiz_record["title"],
        quiz=quiz_data
    )

# -----------------------
# FETCH QUIZ BY ID
# -----------------------
@app.get("/quiz/{quiz_id}", status_code=200)
def get_quiz_by_id(quiz_id: str):
    quiz = quiz_collection.find_one({"_id": ObjectId(quiz_id)})
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")

    return {
        "quiz_id": str(quiz["_id"]),
        "url": quiz["url"],
        "title": quiz["title"],
        "quiz": quiz["full_quiz_data"]
    }

# -----------------------
# GET QUIZ HISTORY
# -----------------------
@app.get("/history", status_code=200)
def get_quiz_history(skip: int = 0, limit: int = 20):
    quizzes = list(quiz_collection.find().skip(skip).limit(limit).sort("date_generated", -1))
    return {
        "count": len(quizzes),
        "items": [
            {"quiz_id": str(q["_id"]), "url": q["url"], "title": q["title"], "date_generated": q.get("date_generated")}
            for q in quizzes
        ]
    }

# -----------------------
# FULL QUIZ HISTORY
# -----------------------
@app.get("/history/full", status_code=200)
def get_full_history():
    quizzes = list(quiz_collection.find().sort("date_generated", -1))
    return [
        {
            "quiz_id": str(q["_id"]),
            "url": q["url"],
            "title": q["title"],
            "date_generated": q.get("date_generated"),
            "quiz": q["full_quiz_data"]
        }
        for q in quizzes
    ]
