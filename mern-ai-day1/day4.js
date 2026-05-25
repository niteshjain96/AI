import { GoogleGenAI } from "@google/genai";
import dotenv from 'dotenv';

dotenv.config();

const ai=new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function startDay4(){
    try {
        console.log("Gemini API responding");
        const res=await ai.models.generateContent({
            model:"gemini-2.5-flash",
            contents:"Tell me what is NODE JS"
        })
        console.log(res.text);
        console.log("📊 Token Usage Details:", res.usageMetadata);
    } catch (error) {
        console.log(error);
    }
}

startDay4();