# crew.py

from crewai import Crew
from tasks import (
    planner_task, budget_task, optimizer_task, replanner_task,
    place_task, city_guide_task, intent_task, eco_task, hotel_task, chatbot_task
)

planner_crew = Crew(tasks=[planner_task])
budget_crew = Crew(tasks=[budget_task])
optimizer_crew = Crew(tasks=[optimizer_task])
replanner_crew = Crew(tasks=[replanner_task])
place_crew = Crew(tasks=[place_task])
city_guide_crew = Crew(tasks=[city_guide_task])
intent_crew = Crew(tasks=[intent_task])
eco_crew = Crew(tasks=[eco_task])
hotel_crew = Crew(tasks=[hotel_task])
chatbot_crew = Crew(
    agents=[chatbot_task.agent],
    tasks=[chatbot_task],
    verbose=True
)

__all__ = [
    "planner_crew", "budget_crew", "optimizer_crew", "replanner_crew",
    "place_crew", "city_guide_crew", "intent_crew", "eco_crew", "hotel_crew"
]
