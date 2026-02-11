
import { GoogleGenAI, Type } from "@google/genai";
import { Patient, ClinicalAction } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function summarizePatientStatus(patient: Patient) {
  const actionsSummary = patient.actions.map(a => 
    `- [${a.status}] ${a.title}: ${a.description} (Dept: ${a.department})`
  ).join('\n');

  const vitalsSummary = patient.vitals.slice(-1).map(v => 
    `Last Vitals: BP ${v.bp}, HR ${v.heartRate}, Temp ${v.temp}, O2 ${v.oxygen}`
  ).join('\n');

  const prompt = `
    Summarize the following patient's clinical status for a quick shift-handover.
    Patient: ${patient.name}, ${patient.age}y ${patient.gender}. 
    Diagnosis: ${patient.diagnosis}
    
    Recent Vitals:
    ${vitalsSummary}
    
    Current Workflow & Actions:
    ${actionsSummary}
    
    Provide a concise (3-4 bullet points) summary focusing on what's critical and what's pending.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 0 }
      }
    });
    return response.text || "Summary unavailable.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error generating AI summary.";
  }
}
