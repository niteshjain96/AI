import { GoogleGenAI, Type } from "@google/genai";
import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
const PORT = 3000;

// JSON और Form डेटा पढ़ने के लिए मिडलवेयर
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// ESM में __dirname सेट करना
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. फ्रंटएंड UI के लिए रूट राउट
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 2. एआई प्रोसेसिंग के लिए POST API EndPoint
app.post('/api/screen', async (req, res) => {
    try {
        const { jobRequirement, resumes } = req.body;

        if (!jobRequirement || !resumes) {
            return res.status(400).json({ error: "दोनों फील्ड्स भरना ज़रूरी है!" });
        }

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Analyze these resumes:\n${resumes}\n\nBased on this Job Requirement:\n${jobRequirement}`,
            config: {
                systemInstruction: "You are an expert HR ATS. Extract data from resumes and screen them strictly against the job requirement.",
                temperature: 0.0,
                thinkingConfig: { thinkingBudget: 0 },
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    description: "List of screened candidates.",
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            candidateName: { type: Type.STRING },
                            email: { type: Type.STRING },
                            extractedSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
                            matchScoreOutof10: { type: Type.INTEGER },
                            hrDecision: { type: Type.STRING, enum: ["SHORTLISTED", "REJECTED"] },
                            shortReason: { type: Type.STRING }
                        },
                        required: ["candidateName", "email", "matchScoreOutof10", "hrDecision", "shortReason"]
                    }
                }
            }
        });

        // जेमिनी से आई JSON स्ट्रिंग को पार्स करके फ्रंटएंड को भेजें
        const resultData = JSON.parse(response.text);
        res.json(resultData);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "एआई प्रोसेसिंग में कोई दिक्कत आई है।" });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 सर्वर चालू हो गया है: http://localhost:${PORT}`);
});