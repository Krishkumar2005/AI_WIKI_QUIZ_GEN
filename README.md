## AI_WikiQuiz_Generator
The AI WikiQuiz Generator is a full-stack web application that allows users to enter any Wikipedia URL and automatically generate a clean and concise summary, AI-generated quiz questions. All generated results are stored securely in a database, enabling users to revisit summaries and quizzes anytime.
How to Run the project:

Backend:
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
Create .env with:
GEMINI_API_KEY=your_key
DATABASE_URL=mongodb+srv://<db_user_name>:<db_password>@cluster0.xnybiew.mongodb.net/

Frontend:
cd frontend
npm install
npm run dev
Create .env with:
VITE_BACKEND_URL=http://127.0.0.1:8000
This project integrates web scraping, LLM-based quiz generation, MongoDb Atlas Storage, and a simple UI for viewing generated quizzes and history.
the requirements.txt 
fastapi
uvicorn
pymongo
dnspython
requests
beautifulsoup4
langchain-core
langchain-google-genai
python-dotenv 
pydantic



## LangChain prompt templates used for quiz and related-topic generation. 


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

# Backend Live Url: https://ai-wiki-quiz-gen.onrender.com
# Frontend Live Url: https://ai-wiki-quiz-gen.vercel.app
# Screenshots of Quiz generation page (Tab 1), History view (Tab 2), and Details modal Drive Link of Folder: https://drive.google.com/drive/folders/1zPxrKW4lcGJZjM1v9jxzX0aVjJsW1FBm?usp=sharing
# Resume Drive Link: https://drive.google.com/file/d/1SdifQjXZhvHTM7LZGzl1pNh1A1qRttc6/view?usp=sharing 

