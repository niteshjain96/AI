import { GoogleGenAI, Type } from "@google/genai";
import dotenv from 'dotenv';

dotenv.config();

const ai=new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function startDay3(){
    try {
        console.log("Gemini API responding");
        const rawCustomerMessage = "Hey, my name is Nitesh. I ordered a laptop yesterday with order ID #9921, but my screen is completely broken and cracked! This is super urgent, please refund my money immediately.";
        const res=await ai.models.generateContent({
            model:"gemini-2.5-flash",
            contents:rawCustomerMessage,
            config:{
                systemInstruction: "You are an advanced data extraction API. Look at the customer message and extract the required information accurately.",
                temperature:0.0,
                thinkingConfig:{thinkingBudget:0},
                responseMimeType:"application/json",
                responseSchema:{
                    type:Type.OBJECT,
                    properties:{
                        customerName:{
                            type:Type.STRING,
                            description:"The name of customer if present"
                        },
                        orderId: { 
                            type: Type.STRING, 
                            description: "Extract the order ID or reference number." 
                        },
                        mainIssue: { 
                            type: Type.STRING, 
                            description: "A short 1-line summary of the problem." 
                        },
                        urgencyLevel: { 
                            type: Type.STRING, 
                            enum: ["LOW", "MEDIUM", "HIGH", "CRITICAL"], // एआई को सिर्फ इन्हीं 4 में से एक को चुनना होगा
                            description: "Determine how urgent the issue is based on text emotion." 
                        }
                    },
                    required: ["customerName", "mainIssue", "urgencyLevel"]
                }
            }
        })
        console.log(res.text);
        const jsonObject = JSON.parse(res.text);
        console.log(jsonObject);
        console.log(`\n📌 कस्टमर का नाम: ${jsonObject.customerName}`);
        console.log(`📌 अर्जेंट है या नहीं?: ${jsonObject.urgencyLevel}`);
        console.log("📊 Token Usage Details:", res.usageMetadata);
    } catch (error) {
        console.log(error);
    }
}

startDay3();


// Gemini API responding
// {
//   "customerName": "Nitesh",
//   "mainIssue": "Laptop screen is completely broken and cracked.",
//   "urgencyLevel": "CRITICAL",
//   "orderId": "9921"
// }
// {
//   customerName: 'Nitesh',
//   mainIssue: 'Laptop screen is completely broken and cracked.',
//   urgencyLevel: 'CRITICAL',
//   orderId: '9921'
// }

// 📌 कस्टमर का नाम: Nitesh
// 📌 अर्जेंट है या नहीं?: CRITICAL
// 📊 Token Usage Details: {
//   promptTokenCount: 65,
//   candidatesTokenCount: 52,
//   totalTokenCount: 117,
//   promptTokensDetails: [ { modality: 'TEXT', tokenCount: 65 } ],
//   serviceTier: 'standard'
// }