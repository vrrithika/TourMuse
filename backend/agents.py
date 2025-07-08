from langchain_community.llms import Ollama
from crewai import Agent
from crewai import LLM
from langchain_ollama.llms import OllamaLLM

from crewai import LLM


llm = LLM(
    model="ollama/llama3.2",
    base_url="http://localhost:11434"
)
# 1️⃣ Planner Agent - Generates daily timetable
planner_agent = Agent(
    role="Planner Agent",
    goal="Generate a clear, user-friendly, day-wise travel timetable based on {user_input}.",
    backstory="Expert travel planner with knowledge of world travel timings, optimal routes, and local highlights.",
    allow_delegation=False,
    llm=llm,
    verbose=True,
    max_iter = 3,
    prompt_template="""
    You are an expert travel planner.
    Given: {{user_input}}
    Generate a daily itinerary with time slots, place names, address, description, weather, entry fees, and transport method clearly.
    Return in JSON:
    [
      {
        "day": 1,
        "date": "YYYY-MM-DD",
        "slots": [
          {
            "time": "09:00",
            "duration": "2 hours",
            "place": "Name",
            "address": "Address",
            "description": "Short description",
            "weather": "Sunny, 22°C",
            "entry_fee": "$10",
            "transport_method": "Subway"
          },
          ...
        ]
      },
      ...
    ]
    
    """
)

# 2️⃣ Budget Agent - Computes detailed cost
budget_agent = Agent(
    role="Budget Agent",
    goal="Calculate a detailed budget split for accommodation, meals, transport, activities, and shopping based on plan and user budget.",
    backstory="Expert travel budget analyst with data on typical costs in various cities.",
    allow_delegation=False,
    llm=llm,
    verbose=True,
    prompt_template="""
    You are a travel budget analyst.
    Given the user's destination, travel dates, preferences, and draft itinerary, calculate:
    - Accommodation, Meals, Transport, Activities, Shopping costs
    - Provide a total budget ensuring it is within the user-specified limit.
    - The budget entered by the user is in Indian Rupees (INR). 
    Return in JSON:
    {
      "Accommodation": "$300",
      "Meals": "$180",
      "Transport": "$120",
      "Activities": "$150",
      "Shopping": "$100",
      "Total": "$850"
    }
    """
)

# 3️⃣ Optimizer Agent - Suggests cost-cutting changes
optimizer_agent = Agent(
    role="Optimizer Agent",
    goal="Suggest ways to reduce costs in specific categories like accommodation, meals, transport, or activities while retaining trip quality.",
    backstory="Optimization expert for travel costs.",
    allow_delegation=False,
    llm=llm,
    verbose=True,
    prompt_template="""
    You are a cost optimizer for travel.
    Given the current budget breakdown and user selection of what to optimize (accommodation, meals, etc.), suggest changes to reduce costs while retaining experience quality.
    Return a new optimized budget breakdown JSON.
    """
)

# 4️⃣ Replanner Agent - Creates alternate plans
replanner_agent = Agent(
    role="Replanner Agent",
    goal="Generate an alternate itinerary based on weather changes, event conflicts, or user dissatisfaction.",
    backstory="Expert in replanning travel based on live updates.",
    allow_delegation=False,
    llm=llm,
    verbose=True,
    prompt_template="""
    You are a replanning agent.
    Given the previous plan, new conditions (weather/event/user feedback), and constraints, generate a new daily itinerary with revised timings and places if needed.
    Return in the same structured JSON as the Planner Agent.
    """
)

# 5️⃣ Place Agent - Provides detailed place info
place_agent = Agent(
    role="Place Agent",
    goal="Provide detailed information for a specific place in the itinerary.",
    backstory="Place information expert with data on attractions.",
    allow_delegation=False,
    llm=llm,
    verbose=True,
    prompt_template="""
    You are a place detail provider.
    Given the name and location of a place, return:
    - Entry fee, address, weather, short description, top highlights, nearby restaurants, map link, and available transport.
    Return in structured JSON.
    """
)

# 6️⃣ City Guide Agent - Provides local info
city_guide_agent = Agent(
    role="City Guide Agent",
    goal="Provide local information including visa info, customs, public transport tips, and local events.",
    backstory="Expert city guide bot.",
    allow_delegation=False,
    llm=llm,
    verbose=True,
    prompt_template="""
    You are a city guide.
    Given the user's destination and dates, return:
    - Visa information
    - Local customs
    - Public transport tips
    - Local events during the travel period
    Return in structured JSON.
    """
)

# 7️⃣ Intent Agent - Parses user inputs
intent_agent = Agent(
    role="Intent Agent",
    goal="Parse user inputs from the frontend (destination, dates, budget, mood, preferences) and prepare a clean JSON to pass to the Planner Agent.",
    backstory="Intent parser bot.",
    allow_delegation=False,
    llm=llm,
    verbose=True,
    prompt_template="""
    You are an intent parser.
    Given user raw inputs, extract:
    - Destination
    - Dates
    - Budget
    - Mood (relax, adventure, culture)
    - Preferences (eco-friendly, dynamic replanning)
    Return in clean structured JSON.
    """
)

# 8️⃣ Eco Agent - Suggests greener alternatives
eco_agent = Agent(
    role="Eco Agent",
    goal="Suggest eco-friendly alternatives for transport and activities.",
    backstory="Expert in sustainable travel planning.",
    allow_delegation=False,
    llm=llm,
    verbose=True,
    prompt_template="""
    You are a sustainable travel advisor.
    Given the itinerary, suggest:
    - Greener transport options
    - Eco-friendly activities
    - Sustainable accommodation suggestions
    Return in structured JSON.
    """
)

hotel_agent = Agent(
    role="Hotel Generator Agent",
    goal="Generate hotel options by budget tier.",
    backstory="Global hotel recommender.",
    allow_delegation=True,
    llm=llm,
    verbose=True,
    prompt_template="""
Given location and dates, return:
{
  "budget_hotels": [],
  "mid_range_hotels": [],
  "luxury_hotels": []
}
"""
)


chatbot_agent = Agent(
    role="City and Itinerary Chatbot",
    goal="Answer user questions about cities and places based on, modify travel plans on demand.",
    backstory=(
        "You are a friendly and accurate travel chatbot for TourMuse. "
        "You answer questions about cities, food, transport, attractions, and modify itineraries on request, "
        "respecting user preferences like eco-friendliness and budget."
    ),
    allow_delegation=True,
    llm=llm,
    verbose=True,
    prompt_template="""
You are TourMuse, an intelligent travel assistant capable of understanding and modifying user itineraries with full context.

Here is the context:
- Current Plan: {current_plan}
- Budget: {budget}
- Optimized Plan: {optimized_plan}
- Replanned Plan: {replanned_plan}
- Eco Suggestions: {eco_suggestions}
- Hotels: {hotels}
- City Guide: {city_guide}

User's Message:
"{user_message}"

Using the above context:
- Answer the user's query precisely.
- If they request modifications, propose clear actionable changes to the itinerary, considering the budget, eco-friendliness, and user preferences.
- If they ask for information about a place, use the city guide and related context.
- Keep the response warm, helpful, and concise.
"""
)


# Export for crew.py and tasks.py imports
__all__ = [
    "planner_agent",
    "budget_agent",
    "optimizer_agent",
    "replanner_agent",
    "place_agent",
    "city_guide_agent",
    "intent_agent",
    "eco_agent",
    "hotel_agent"
]
