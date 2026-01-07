
import { GoogleGenAI } from "@google/genai";
import { Booking, Vehicle } from "../types";

// Always use new GoogleGenAI({ apiKey: process.env.API_KEY }) to initialize the client.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateDailyBriefing = async (
  bookings: Booking[], 
  vehicles: Vehicle[]
): Promise<string> => {
  try {
    const activeCount = bookings.filter(b => b.status === 'Active').length;
    const availableCount = vehicles.filter(v => v.status === 'Available').length;
    
    // Prepare a context string for the AI
    const context = `
      You are an AI assistant for KwasaShuttle, a vehicle rental company.
      Current Data:
      - Active Rentals: ${activeCount}
      - Available Vehicles: ${availableCount}
      - Today's date: ${new Date().toLocaleDateString()}
      - Bookings List: ${JSON.stringify(bookings.map(b => ({ client: b.customerName, car: b.vehicleName, status: b.status })))}
      - Fleet Status: ${JSON.stringify(vehicles.map(v => ({ model: v.model, status: v.status })))}
      
      Task: Write a concise, professional 3-sentence daily briefing for the fleet manager. 
      Highlight urgent items (pickups/returns today) and general fleet health. 
      Keep it encouraging.
    `;

    // Use gemini-3-flash-preview for basic text tasks like summarization and briefings.
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: context,
    });

    // Extract text directly using response.text as per guidelines.
    return response.text || "Unable to generate briefing.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "AI service is currently unavailable.";
  }
};

export const askAiAssistant = async (
  question: string, 
  contextData: string, 
  persona: string = 'fleet manager assistant'
): Promise<string> => {
  try {
    // Use gemini-3-flash-preview for general text-based Q&A tasks.
    const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `
        Context Information: 
        ${contextData}
        
        User Question: ${question}
        
        System Instruction: You are a helpful ${persona}. 
        - Keep answers brief, professional, and friendly.
        - If the answer is not in the context, politely say you don't know and suggest contacting support.
        - Do not invent information.
        `
    });
    // Extract text directly using response.text as per guidelines.
    return response.text || "I couldn't understand that.";
  } catch (error) {
    console.error("AI Error", error);
    return "I'm having trouble connecting to the server right now.";
  }
}
