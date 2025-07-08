import { db } from "./firebase"
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
} from "firebase/firestore"

// Types for better type safety
export interface Trip {
  id?: string
  userId: string
  location: string
  startDate: Date | Timestamp
  endDate: Date | Timestamp
  budget: number
  travelStyle: string
  ecoFriendly: boolean
  dynamicReplanning: boolean
  status: 'planned' | 'active' | 'completed' | 'cancelled'
  createdAt: Timestamp
  lastUpdated: Timestamp
  itinerary?: any // You can define a more specific type for itinerary data
}

export interface TripInput {
  location: string
  startDate: Date
  endDate: Date
  budget: number
  travelStyle: string
  ecoFriendly: boolean
  dynamicReplanning: boolean
  itinerary?: any
}

// Add new trip
export async function addTrip(userId: string, tripData: TripInput): Promise<string> {
  try {
    const tripsCollection = collection(db, "trips")
    const docRef = await addDoc(tripsCollection, {
      ...tripData,
      userId,
      startDate: Timestamp.fromDate(tripData.startDate),
      endDate: Timestamp.fromDate(tripData.endDate),
      createdAt: Timestamp.now(),
      lastUpdated: Timestamp.now(),
      status: "planned",
    })
    return docRef.id
  } catch (error) {
    console.error("Error adding trip:", error)
    throw new Error("Failed to add trip")
  }
}

// Get all trips for a user
export async function getTrips(userId: string): Promise<Trip[]> {
  try {
    const tripsCollection = collection(db, "trips")
    const q = query(
      tripsCollection, 
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    )
    const snapshot = await getDocs(q)
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Trip[]
  } catch (error) {
    console.error("Error getting trips:", error)
    throw new Error("Failed to get trips")
  }
}

// Get a specific trip by ID
export async function getTrip(tripId: string): Promise<Trip | null> {
  try {
    const docRef = doc(db, "trips", tripId)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Trip
    } else {
      return null
    }
  } catch (error) {
    console.error("Error getting trip:", error)
    throw new Error("Failed to get trip")
  }
}

// Update a trip
export async function updateTrip(tripId: string, updatedData: Partial<TripInput>): Promise<void> {
  try {
    const docRef = doc(db, "trips", tripId)
    const updateData: any = {
      ...updatedData,
      lastUpdated: Timestamp.now(),
    }

    // Convert dates to Timestamps if they exist
    if (updatedData.startDate) {
      updateData.startDate = Timestamp.fromDate(updatedData.startDate)
    }
    if (updatedData.endDate) {
      updateData.endDate = Timestamp.fromDate(updatedData.endDate)
    }

    await updateDoc(docRef, updateData)
  } catch (error) {
    console.error("Error updating trip:", error)
    throw new Error("Failed to update trip")
  }
}

// Update trip status
export async function updateTripStatus(tripId: string, status: Trip['status']): Promise<void> {
  try {
    const docRef = doc(db, "trips", tripId)
    await updateDoc(docRef, {
      status,
      lastUpdated: Timestamp.now(),
    })
  } catch (error) {
    console.error("Error updating trip status:", error)
    throw new Error("Failed to update trip status")
  }
}

// Delete a trip
export async function deleteTrip(tripId: string): Promise<void> {
  try {
    const docRef = doc(db, "trips", tripId)
    await deleteDoc(docRef)
  } catch (error) {
    console.error("Error deleting trip:", error)
    throw new Error("Failed to delete trip")
  }
}

// Get user's recent trips (limit to last 5)
export async function getRecentTrips(userId: string, limit: number = 5): Promise<Trip[]> {
  try {
    const tripsCollection = collection(db, "trips")
    const q = query(
      tripsCollection,
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    )
    const snapshot = await getDocs(q)
    const trips = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Trip[]
    
    return trips.slice(0, limit)
  } catch (error) {
    console.error("Error getting recent trips:", error)
    throw new Error("Failed to get recent trips")
  }
}

// Get trips by status
export async function getTripsByStatus(userId: string, status: Trip['status']): Promise<Trip[]> {
  try {
    const tripsCollection = collection(db, "trips")
    const q = query(
      tripsCollection,
      where("userId", "==", userId),
      where("status", "==", status),
      orderBy("createdAt", "desc")
    )
    const snapshot = await getDocs(q)
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Trip[]
  } catch (error) {
    console.error("Error getting trips by status:", error)
    throw new Error("Failed to get trips by status")
  }
}