interface ChatbotResponse {
  message: string
  suggestions?: string[]
  tripData?: any
  action?: string
}

export const chatbotService = {
  async sendMessage(message: string, currentTrip?: any): Promise<ChatbotResponse> {
    try {
      // In production, this would call your backend API
      const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          currentTrip,
          userId: "current-user-id", // Get from auth context
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get chatbot response")
      }

      return await response.json()
    } catch (error) {
      console.error("Chatbot service error:", error)

      // Fallback responses for demo
      return this.getFallbackResponse(message, currentTrip)
    }
  },

  getFallbackResponse(message: string, currentTrip?: any): ChatbotResponse {
    const lowerMessage = message.toLowerCase()

    if (lowerMessage.includes("restaurant") || lowerMessage.includes("food") || lowerMessage.includes("eat")) {
      return {
        message:
          "I'd be happy to help you find great restaurants! Based on your location and preferences, I can suggest local favorites, fine dining options, or budget-friendly eats. What type of cuisine are you in the mood for?",
        suggestions: [
          "Find Italian restaurants nearby",
          "Show me budget-friendly options",
          "Recommend fine dining",
          "Local street food spots",
        ],
      }
    }

    if (lowerMessage.includes("weather") || lowerMessage.includes("rain") || lowerMessage.includes("sunny")) {
      return {
        message:
          "Weather can definitely affect your travel plans! I can suggest indoor activities for rainy days or outdoor adventures for sunny weather. I can also help you pack appropriately based on the forecast.",
        suggestions: [
          "Indoor activities for rainy weather",
          "Best outdoor spots for sunny days",
          "What to pack for this weather",
          "Weather-appropriate clothing tips",
        ],
      }
    }

    if (lowerMessage.includes("budget") || lowerMessage.includes("money") || lowerMessage.includes("cost")) {
      return {
        message:
          "I can help you optimize your travel budget! I can suggest ways to save money on accommodation, transportation, meals, and activities while still having an amazing trip.",
        suggestions: [
          "Ways to save on accommodation",
          "Budget-friendly transportation",
          "Free activities and attractions",
          "Money-saving meal tips",
        ],
      }
    }

    if (lowerMessage.includes("change") || lowerMessage.includes("modify") || lowerMessage.includes("update")) {
      return {
        message:
          "I can help you modify your trip! Whether you want to change dates, add new destinations, adjust your budget, or swap activities, I'm here to help make your perfect itinerary.",
        suggestions: [
          "Change travel dates",
          "Add new destinations",
          "Modify daily activities",
          "Adjust budget allocation",
        ],
        action: "modify_trip",
      }
    }

    if (lowerMessage.includes("plan") && (lowerMessage.includes("day") || lowerMessage.includes("trip"))) {
      return {
        message:
          "I'd love to help you plan your trip! Tell me your destination, travel dates, budget, and what kind of experience you're looking for (adventure, relaxation, culture, etc.), and I'll create a personalized itinerary for you.",
        suggestions: [
          "Plan a 3-day city break",
          "Create a week-long adventure",
          "Design a romantic getaway",
          "Plan a family vacation",
        ],
      }
    }

    // Default response
    return {
      message:
        "I'm here to help with all your travel needs! I can assist with planning itineraries, finding restaurants, suggesting activities, optimizing budgets, and answering any travel questions you have. What would you like help with?",
      suggestions: [
        "Plan a new trip",
        "Find restaurants nearby",
        "Suggest activities",
        "Help with my budget",
        "Modify my current trip",
      ],
    }
  },
}
