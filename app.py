from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware

from extractors.ppt_extractor import extract_text_from_ppt
from extractors.pdf_extractor import extract_text_from_pdf
from evaluator.judge import evaluate_project

import shutil
import os
import asyncio

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_FOLDER = "uploads"

os.makedirs(UPLOAD_FOLDER, exist_ok=True)


@app.get("/")
def home():
    return {"message": "HackJudge AI Backend Running"}


@app.post("/upload/")
async def upload_ppts(files: list[UploadFile] = File(...)):

    leaderboard = []

    for file in files:

        try:

            file_path = f"{UPLOAD_FOLDER}/{file.filename}"

            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)

            # PDF SUPPORT
            if file.filename.endswith(".pdf"):

                extracted_text = extract_text_from_pdf(file_path)

            # PPT / PPTX SUPPORT
            else:

                extracted_text = extract_text_from_ppt(file_path)

            evaluation = evaluate_project(extracted_text)

            total_score = (
                evaluation["innovation"] +
                evaluation["feasibility"] +
                evaluation["technical_depth"] +
                evaluation["market_potential"] +
                evaluation["presentation"]
            )

            leaderboard.append({
                "filename": file.filename,
                "score": total_score,
                "evaluation": evaluation
            })

            await asyncio.sleep(2)

        except Exception as e:

            print("ERROR:", e)

            leaderboard.append({
                "filename": file.filename,
                "score": 0,
                "evaluation": {
                    "innovation": 0,
                    "feasibility": 0,
                    "technical_depth": 0,
                    "market_potential": 0,
                    "presentation": 0,
                    "strengths": [],
                    "weaknesses": [str(e)],
                    "verdict": "Evaluation Failed"
                }
            })

    leaderboard = sorted(
        leaderboard,
        key=lambda x: x["score"],
        reverse=True
    )

    return {
        "leaderboard": leaderboard
    }