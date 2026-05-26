import { GoogleGenAI, Type } from "@google/genai";
import dotenv from 'dotenv';

dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// 🛠️ Simulated Backend Controller Services
function handleBugTracking(query, action) {
    console.log(`\n➡️ [ROUTER SUCCEEDED] Dispatched to BugTrackerService.`);
    console.log(`📌 Action Assigned: ${action}`);
}

function handleQueryOptimization(query, action) {
    console.log(`\n➡️ [ROUTER SUCCEEDED] Dispatched to DatabaseProfilerService.`);
    console.log(`📌 Action Assigned: ${action}`);
}

async function routeUserQuery(incomingUserMessage) {
    try {
        console.log(`\n⏳ [Gateway] Analyzing incoming text payload: "${incomingUserMessage}"`);

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: incomingUserMessage,
            config: {
                // Giving the AI a strict job as an infrastructure router
                systemInstruction: "You are a high-speed corporate routing gateway API. Analyze the incoming text query and classify its operational intent strictly into one of the allowed enum buckets.",
                temperature: 0.0,
                thinkingConfig: { thinkingBudget: 0 },
                responseMimeType: "application/json",
                
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        // 🎯 The Enum constraint ensures absolute predictability
                        targetIntent: {
                            type: Type.STRING,
                            enum: ["DEBUG_REQUEST", "OPTIMIZATION_REQUEST", "INVALID_OR_OFFTOPIC"],
                            description: "The matched bucket key for the incoming string execution."
                        },
                        confidenceScore: { 
                            type: Type.NUMBER, 
                            description: "Mathematical confidence from 0.0 to 1.0" 
                        },
                        recommendedAction: { 
                            type: Type.STRING, 
                            description: "A short 1-line action instruction for the target controller." 
                        }
                    },
                    required: ["targetIntent", "confidenceScore", "recommendedAction"]
                }
            }
        });

        // Parse the rigid JSON payload directly
        const routerPayload = JSON.parse(response.text);
        console.log("🤖 Gateway Classification Output:", routerPayload);

        // 🚀 MERN Conditional Routing Architecture Block
        switch(routerPayload.targetIntent) {
            case "DEBUG_REQUEST":
                handleBugTracking(incomingUserMessage, routerPayload.recommendedAction);
                break;
                
            case "OPTIMIZATION_REQUEST":
                handleQueryOptimization(incomingUserMessage, routerPayload.recommendedAction);
                break;
                
            case "INVALID_OR_OFFTOPIC":
                console.log(`\n❌ [ROUTER BLOCKED] Query drops at Firewall Layer. Reason: Off-topic request rejected.`);
                break;
                
            default:
                console.log("\n❌ Fallback: Unhandled unexpected routing execution path.");
        }

    } catch (error) {
        console.error("❌ Gateway routing execution fault:", error);
    }
}

// 🧪 Running Multi-Scenario Routing Tests
async function runDay5Suite() {
    // Scenario A: Bug tracking intent
    await routeUserQuery("My database connection times out immediately after 5 seconds on the production server.");
    
    // Scenario B: Off-topic intent
    await routeUserQuery("Can you write a romantic poem for my friend?");
}

runDay5Suite();