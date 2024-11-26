import cors from "cors";
import express from "express";
import { config } from "dotenv";
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

config();
const app = express();
app.use(
    cors({
        origin: "*",
    })
);

app.get("/words", async (_, res) => {
    const genAI = new GoogleGenerativeAI(process.env.API_KEY);
    const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash-8b",
        generationConfig: {
            responseMimeType: "application/json",
            responseSchema: {
                type: SchemaType.ARRAY,
                items: {
                    type: SchemaType.OBJECT,
                    properties: {
                        word: {
                            type: SchemaType.STRING,
                            description: "A random and very simple english word",
                        },
                        description: {
                            type: SchemaType.STRING,
                            description: "Good explanation of the random word",
                        },
                    },
                },
            },
        },
    });

    const prompt =
        "Generate a single random, very simple english word with length 5 to 10 with its good explanation";

    const result = await model.generateContent(prompt);
    return res.json({ result: result.response.text() });
});

app.listen(3000, () => {
    console.log("http://localhost:3000");
});
