from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class Option(BaseModel):
    index: int
    text: str

class Question(BaseModel):
    index: int
    text: str
    options: List[Option]
    correct_index: int
    explanation: Optional[str] = None
    provenance: Optional[dict] = None

class QuizOutput(BaseModel):
    id: Optional[int] = None
    url: str
    title: Optional[str] = None
    summary: Optional[str] = None
    questions: List[Question] = Field(default_factory=list)
    created_at: Optional[datetime] = None