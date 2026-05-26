import { GoogleGenAI, Type } from "@google/genai";
import dotenv from 'dotenv';

dotenv.config();

const ai=new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function startDay4(){
    try {
        const request=`
        PROFILE_ENTRY #01 : Nitesh is a Senior Developer in delhi. He manages full-stack with NODE , React and Express.
        PROFILE_ENTRY #01 : Chinu is a UPSC Tester. She manages frontend with REACT.
        `

        const response=await ai.models.generateContent({
            model:"gemini-2.5-flash",
            contents:`Parse and transform raw data into a validated database entries : ${request}`,
            config:{
                systemInstruction: "Your sole job is to parse unstructured profiles into clean database array collections",
                temperature:0.0,
                thinkingConfig:{thinkingBudget:0},
                responseMimeType:"application/json",
                responseSchema:{
                    type:Type.ARRAY,
                    description:"Array containing profile objects",
                    items:{
                        type:Type.OBJECT,
                        properties:{
                            employeeName:{type:Type.STRING},
                        jobRole:{type:Type.STRING},
                        baseLocation:{type:Type.STRING},
                        technicalSkills:{
                            type:Type.ARRAY,
                            items:{type:Type.STRING}
                        }
                        },
                        
                        required:["employeeName","jobRole","technicalSkills"],
                    },
                }

            }
        })
        console.log(response.text);
        const cleanArray=JSON.parse(response.text);
        console.log(cleanArray);
        console.log("📊 Token Usage Details:", response.usageMetadata);
    } catch (error) {
        console.log(error);
    }
}

startDay4();