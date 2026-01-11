import os
import json
from typing import List, Dict, Any
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from dotenv import load_dotenv
load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY")
if not API_KEY:
    raise ValueError("GEMINI_API_KEY is missing in .env file!")

llm = ChatGoogleGenerativeAI(
    model="gemini-flash-latest",
    temperature=0.3,
    max_output_tokens=6000,
    google_api_key=API_KEY
)


quiz_schema = {
    "type": "object",
    "properties": {
        "title": {"type": "string"},
        "summary": {"type": "string"},
        "questions": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "question": {"type": "string"},
                    "options": {
                        "type": "array",
                        "items": {"type": "string"}
                    },
                    "correct_answer": {"type": "string"}
                },
                "required": ["question", "options", "correct_answer"]
            }
        },
        "related_topics":{
            "type": "array",
            "items": {
                "type": "string"
            }
        }
    },
    "required": ["title", "summary", "questions", "related_topics"]
}

parser = JsonOutputParser(json_schema=quiz_schema)


prompt = ChatPromptTemplate.from_messages([
    ("system",
     "You are an AI that generates educational quizzes from Wikipedia articles. "
     "Your job is to produce a JSON quiz containing:\n"
     "- A short summary\n"
     "- 5 to 10 high-quality multiple-choice questions\n"
     "- Each question must have 4 options\n"
     "- One correct answer\n"
     "- Related Topics\n"
     "Follow the JSON format exactly. Do NOT include extra text."
     ),
    ("user",
     "ARTICLE CONTENT:\n\n{article_text}\n\n"
     "Generate the quiz strictly following this JSON schema:\n"
     "{format_instructions}"
     )
])

# ------------------------------
# Function: Generate quiz JSON
# ------------------------------
def generate_quiz_from_text(article_text: str) -> Dict[str, Any]:
    """Send cleaned Wikipedia text to Gemini and receive JSON quiz."""
    
    # Prepare prompt
    chain = prompt | llm | parser

    # Run the chain
    result = chain.invoke({
        "article_text": article_text,
        "format_instructions": parser.get_format_instructions(),
    })

    # Ensure result is a Python dict
    if isinstance(result, str):
        return json.loads(result)
    
    return result


# ---------------------------------------------------------
# STEP 2: Convert Article Text → AI Quiz (Final Function)
# ---------------------------------------------------------

def create_quiz_from_article(article_title: str, article_text: str) -> Dict[str, Any]:
    """
    This function takes:
    - Wikipedia article title
    - Cleaned article text

    And generates:
    - title
    - summary
    - list of MCQ questions (with options + correct answer)

    Returns Python dictionary ready to save in DB.
    """

    # Call the LLM from Step 1
    quiz_data = generate_quiz_from_text(article_text)

    # Inject the title if not given
    if "title" not in quiz_data or not quiz_data["title"]:
        quiz_data["title"] = article_title

    # Validate questions count (minimum 5)
    if "questions" not in quiz_data or len(quiz_data["questions"]) < 3:
        raise ValueError("Not enough quiz questions generated. Try another article.")

    # Validate each question structure
    for i, q in enumerate(quiz_data["questions"]):
        if len(q["options"]) != 4:
            raise ValueError(f"Question {i+1} does not have exactly 4 options.")
        if q["correct_answer"] not in q["options"]:
            raise ValueError(f"Correct answer missing in options for question {i+1}.")

    return quiz_data
