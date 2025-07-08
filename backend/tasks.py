# tasks.py

from crewai import Task
from agents import planner_agent, budget_agent, optimizer_agent, replanner_agent, place_agent, city_guide_agent, intent_agent, eco_agent, hotel_agent, chatbot_agent
#from tools import weather_tool, event_tool, hotel_tool

# Task: Generate daily itinerary
planner_task = Task(
    description= "Generate a **detailed, structured JSON daily itinerary** for the user trip with the following fields:\n"
        "- day\n"
        "- date\n"
        "- time_slots: [{time_range, activity_name, place_name, location, entry_fee, travel_mode, notes, weather, event_info}]\n\n"
        "The output **must be JSON only, no text explanations**, structured cleanly to match frontend expectations.",
    agent=planner_agent,
    #tools=[weather_tool, event_tool, hotel_tool],
    expected_output="JSON itinerary matching frontend slots for TourMuse.",
    output_format="JSON"
)

# Task: Compute detailed budget
budget_task = Task(
    description="Compute a detailed budget breakdown (accommodation, meals, transport, activities, shopping) and return structured JSON.",
    agent=budget_agent,
    expected_output="Budget JSON with day-wise and category-wise costs."
)

# Task: Suggest cost-cutting changes
optimizer_task = Task(
    description="Suggest optimized cost-cutting recommendations for a given trip plan while retaining user preferences.",
    agent=optimizer_agent,
    expected_output="Optimized plan JSON."
)

# Task: Replan itinerary
replanner_task = Task(
    description="Replan the trip itinerary considering new weather or event data.",
    agent=replanner_agent,
    #tools=[weather_tool, event_tool],
    expected_output="Replanned itinerary JSON."
)

# Task: Get detailed place info
place_task = Task(
    description="Provide detailed information for a specific place, including description, entry fees, weather, mini-map coordinates.",
    agent=place_agent,
    #tools=[weather_tool],
    expected_output="Structured JSON for PlaceDetailsModal."
)

# Task: Provide city guide info
city_guide_task = Task(
    description="Provide visa information, local customs, transport tips, and upcoming events for the location.",
    agent=city_guide_agent,
    #tools=[event_tool],
    expected_output="JSON for City Guide page."
)

# Task: Parse user input intent
intent_task = Task(
    description="Parse user input (location, dates, budget, preferences) into structured JSON for triggering trip generation.",
    agent=intent_agent,
    expected_output="Parsed user input JSON."
)

# Task: Suggest eco-friendly alternatives
eco_task = Task(
    description="Suggest greener, eco-friendly alternatives for transport, activities, and accommodation.",
    agent=eco_agent,
    #tools=[hotel_tool],
    expected_output="List of eco-friendly recommendations in JSON."
)

hotel_task = Task(
    description="Generate hotels by budget tier for the location and dates.",
    agent=hotel_agent,
    expected_output="Hotels JSON by tier."
)


from crewai import Task
from agents import chatbot_agent

chatbot_task = Task(
    description=(
        "Respond to user input: {user_message}. "
        "If it is a city or place question, provide clear, accurate information. "
        "If it is an itinerary modification, analyze and suggest updated plans."
    ),
    agent=chatbot_agent,
    expected_output="A helpful, clear, and accurate response to the user's travel-related question or a modified itinerary as per user request."
)



__all__ = [
    "planner_task",
    "budget_task",
    "optimizer_task",
    "replanner_task",
    "place_task",
    "city_guide_task",
    "intent_task",
    "eco_task"
]