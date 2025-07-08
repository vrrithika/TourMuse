# main.py

from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse, FileResponse
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from dotenv import load_dotenv
from pathlib import Path
import uuid
import json
from collections import defaultdict

# user_id -> context dict
user_context = defaultdict(dict)


from crew import (
    planner_crew, budget_crew, optimizer_crew, replanner_crew,
    place_crew, city_guide_crew, intent_crew, eco_crew, hotel_crew, chatbot_crew
)

load_dotenv()
app = FastAPI(title="TourMuse AI Backend")

class TripRequest(BaseModel):
    location: str
    startDate: datetime
    endDate: datetime
    budget: float
    travelStyle: str
    ecoFriendly: bool
    dynamicReplanning: bool

    def to_serialized_dict(self):
        return {
            "location": self.location,
            "startDate": self.startDate.isoformat() if self.startDate else None,
            "endDate": self.endDate.isoformat() if self.endDate else None,
            "budget": self.budget,
            "travelStyle": self.travelStyle,
            "ecoFriendly": self.ecoFriendly,
            "dynamicReplanning": self.dynamicReplanning
        }

class PlaceRequest(BaseModel):
    place_name: str
    location: str
    date: datetime

    def to_serialized_dict(self):
        return {
            "place_name": self.place_name,
            "location": self.location,
            "date": self.date.isoformat() if self.date else None
        }

class ChatbotRequest(BaseModel):
    user_id: str
    message: str

@app.post("/generate-plan")
async def generate_plan(payload: TripRequest):
    try:
        result = planner_crew.kickoff(inputs=payload.to_serialized_dict())
        user_context[payload.user_id]["current_plan"] = result
        return {"plan": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/compute-budget")
async def compute_budget(payload: TripRequest):
    try:
        result = budget_crew.kickoff(inputs=payload.to_serialized_dict())
        user_context[payload.user_id]["budget"] = result
        return {"budget": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/optimize-budget")
async def optimize_budget(payload: TripRequest):
    try:
        result = optimizer_crew.kickoff(inputs=payload.to_serialized_dict())
        user_context[payload.user_id]["optimized_budget"] = result
        return {"optimized_plan": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/replan")
async def replan_trip(payload: TripRequest):
    try:
        result = replanner_crew.kickoff(inputs=payload.to_serialized_dict())
        user_context[payload.user_id]["replan"] = result
        return {"replanned_plan": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/place-details")
async def place_details(payload: PlaceRequest):
    try:
        result = place_crew.kickoff(inputs=payload.to_serialized_dict())
        user_context[payload.user_id]["place_details"] = result
        return {"place_details": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/city-guide")
async def city_guide(payload: TripRequest):
    try:
        result = city_guide_crew.kickoff(inputs=payload.to_serialized_dict())
        user_context[payload.user_id]["city_guide"] = result
        return {"city_guide": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/eco-suggestions")
async def eco_suggestions(payload: TripRequest):
    try:
        result = eco_crew.kickoff(inputs=payload.to_serialized_dict())
        user_context[payload.user_id]["eco_suggestions"] = result
        return {"eco_suggestions": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/generate-hotels")
async def generate_hotels(payload: TripRequest):
    try:
        result = hotel_crew.kickoff(inputs=payload.to_serialized_dict())
        user_context[payload.user_id]["hotels"] = result
        return {"hotels": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/chatbot")
async def chatbot(payload: ChatbotRequest):
    try:
        context = user_context.get(payload.user_id, {})
        chatbot_inputs = {
            "user_message": payload.message,
            "current_plan": context.get("current_plan", "Not available"),
            "budget": context.get("budget", "Not available"),
            "optimized_plan": context.get("optimized_plan", "Not available"),
            "replanned_plan": context.get("replanned_plan", "Not available"),
            "eco_suggestions": context.get("eco_suggestions", "Not available"),
            "hotels": context.get("hotels", "Not available"),
            "city_guide": context.get("city_guide", "Not available")
        }
        result = chatbot_crew.kickoff(inputs=chatbot_inputs)
        return {"response": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))




@app.get("/")
async def root():
    return {"message": "TourMuse AI Backend Running ✅"}
