
from groq import Groq
import json

client = Groq(
    api_key="secret"
)

def evaluate_project(text):

    text = text[:4000]

    prompt = f"""
You are an elite hackathon judge.

Analyze the following project PPT.

Return ONLY valid JSON.

Format:

{{
    "innovation": 0,
    "feasibility": 0,
    "technical_depth": 0,
    "market_potential": 0,
    "presentation": 0,
    "strengths": [],
    "weaknesses": [],
    "verdict": ""
}}

Rules:
- Scores must be out of 20
- strengths = list of strings
- weaknesses = list of strings
- verdict = short sentence
- DO NOT write anything outside JSON

Project:
{text}
"""

    response = client.chat.completions.create(

        model="llama-3.1-8b-instant",

        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ],

        temperature=0.2,
        max_tokens=500
    )

    content = response.choices[0].message.content

    try:
        result = json.loads(content)
        return result

    except Exception as e:

        print("JSON ERROR:", e)

        return {
            "innovation": 10,
            "feasibility": 10,
            "technical_depth": 10,
            "market_potential": 10,
            "presentation": 10,
            "strengths": ["AI parsing failed"],
            "weaknesses": ["Invalid AI response"],
            "verdict": "Evaluation Failed"
        }
