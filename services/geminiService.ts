
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generateProfessionalBio(name: string, title: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a professional, warm, and trustworthy short bio for ${name}, who is a ${title} at EDENIC, a real estate and property management firm located in St. Vincent & the Grenadines. The tagline is "Your property, Our priority!". Keep it under 60 words. IMPORTANT: Do NOT use the phrase "Committed to excellence in real estate and property management," or anything nearly identical. Also do NOT use the word "proudly" or the phrase "proudly serving"—instead say "located in" or "based in" when referring to the location.`,
      config: {
        temperature: 0.7,
        topP: 0.8,
      },
    });
    
    let bioText = response.text || "Dedicated to making your property my priority.";
    
    // Safety check to ensure forbidden phrases are removed if the model repeats them
    const forbiddenPhrase = /Committed to excellence in real estate and property management,?\s*/gi;
    bioText = bioText.replace(forbiddenPhrase, '').trim();

    // Replace "proudly serving" with "located in"
    bioText = bioText.replace(/proudly\s+serving/gi, 'located in').trim();
    
    // Ensure the first letter is capitalized after potential leading phrase removal
    if (bioText.length > 0) {
      bioText = bioText.charAt(0).toUpperCase() + bioText.slice(1);
    }

    return bioText;
  } catch (error) {
    console.error("Error generating bio:", error);
    return "Experienced builder at Edenic focused on delivering high-quality residential solutions and personalized property care.";
  }
}

export async function getMarketInsight() {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Give a 1-sentence trendy real estate market tip for property owners in 2024.",
      config: {
        tools: [{ googleSearch: {} }]
      }
    });
    return {
      text: response.text,
      sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
  } catch (error) {
    return { text: "Sustainable and energy-efficient homes are seeing higher resale values this year.", sources: [] };
  }
}
