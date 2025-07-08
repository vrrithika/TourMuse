# # tools.py

# import requests
# from datetime import datetime
# from dotenv import load_dotenv
# import os

# load_dotenv()

# OPENWEATHER_API_KEY = os.environ.get("OPENWEATHER_API_KEY")
# EVENTBRITE_TOKEN = os.environ.get("EVENTBRITE_TOKEN")
# GOOGLE_MAPS_API_KEY = os.environ.get("GOOGLE_MAPS_API_KEY")

# def get_weather(location, date):
#     """Fetch weather forecast for a location on a specific date"""
#     lat, lon = get_coordinates(location)
#     url = (
#         f"https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}"
#         f"&appid={OPENWEATHER_API_KEY}&units=metric"
#     )
#     response = requests.get(url)
#     data = response.json()
#     target_date = date.strftime("%Y-%m-%d")
#     forecast = next(
#         (item for item in data['list'] if item['dt_txt'].startswith(target_date)),
#         None
#     )
#     if forecast:
#         desc = forecast['weather'][0]['description']
#         temp = forecast['main']['temp']
#         return f"{desc.capitalize()}, {temp}°C"
#     else:
#         return "Weather data unavailable"

# def get_local_events(location, date):
#     """Fetch local events from Eventbrite"""
#     url = (
#         f"https://www.eventbriteapi.com/v3/events/search/?location.address={location}"
#         f"&start_date.range_start={date.isoformat()}T00:00:00Z"
#         f"&start_date.range_end={date.isoformat()}T23:59:59Z"
#     )
#     headers = {"Authorization": f"Bearer {EVENTBRITE_TOKEN}"}
#     response = requests.get(url, headers=headers)
#     data = response.json()
#     events = []
#     for event in data.get("events", [])[:5]:
#         events.append({
#             "name": event["name"]["text"],
#             "start": event["start"]["local"],
#             "end": event["end"]["local"],
#             "url": event["url"]
#         })
#     return events or "No local events found"

# def get_crowd_prediction(place_name, date, time):
#     """Simulated crowd prediction for demonstration"""
#     from random import choice
#     return choice(["Low", "Moderate", "High"])

# def get_place_image(place_name, location):
#     """Fetch a place image using Google Places API"""
#     url = (
#         f"https://maps.googleapis.com/maps/api/place/findplacefromtext/json"
#         f"?input={place_name} {location}&inputtype=textquery&fields=photos&key={GOOGLE_MAPS_API_KEY}"
#     )
#     response = requests.get(url)
#     data = response.json()
#     try:
#         photo_ref = data["candidates"][0]["photos"][0]["photo_reference"]
#         photo_url = (
#             f"https://maps.googleapis.com/maps/api/place/photo"
#             f"?maxwidth=800&photoreference={photo_ref}&key={GOOGLE_MAPS_API_KEY}"
#         )
#         return photo_url
#     except:
#         return "https://via.placeholder.com/800x600.png?text=No+Image"

# def get_nearby_restaurants(location):
#     """Fetch top 3 nearby restaurants using Google Places API"""
#     lat, lon = get_coordinates(location)
#     url = (
#         f"https://maps.googleapis.com/maps/api/place/nearbysearch/json"
#         f"?location={lat},{lon}&radius=1500&type=restaurant&key={GOOGLE_MAPS_API_KEY}"
#     )
#     response = requests.get(url)
#     data = response.json()
#     restaurants = []
#     for place in data.get("results", [])[:3]:
#         restaurants.append({
#             "name": place["name"],
#             "rating": place.get("rating"),
#             "address": place.get("vicinity")
#         })
#     return restaurants or "No nearby restaurants found"

# def get_coordinates(location):
#     """Helper to get lat/lon for a location using Google Maps Geocoding API"""
#     url = (
#         f"https://maps.googleapis.com/maps/api/geocode/json"
#         f"?address={location}&key={GOOGLE_MAPS_API_KEY}"
#     )
#     response = requests.get(url)
#     data = response.json()
#     location_data = data["results"][0]["geometry"]["location"]
#     return location_data["lat"], location_data["lng"]

# __all__ = [
#     "get_weather",
#     "get_local_events",
#     "get_crowd_prediction",
#     "get_place_image",
#     "get_nearby_restaurants"
# ]
