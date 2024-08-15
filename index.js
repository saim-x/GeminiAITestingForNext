require('dotenv').config();
const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
} = require("@google/generative-ai");

const apiKey = process.env.API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
});

const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
};

async function run() {
    const chatSession = model.startChat({
        generationConfig,
        // You can adjust safety settings here if needed
        // safetySettings: [{ category: HarmCategory.SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.HIGH }],
        history: [],
    });

    try {
        const result = await chatSession.sendMessage("Hi");
        const response = result.response;

        // Check if safetyRatings is defined and is an array
        if (response.safetyRatings && Array.isArray(response.safetyRatings)) {
            if (response.safetyRatings.some(rating => rating.probability !== 'NEGLIGIBLE')) {
                console.log("Content blocked due to safety concerns.");
            } else {
                const text = await response.text(); // Ensure to await the text() function
                console.log(text);
            }
        } else {
            console.log("No safety concerns. Response received successfully.");
            const text = await response.text(); // Ensure to await the text() function
            console.log(text);
        }
    } catch (error) {
        console.error("An error occurred:", error.message);
    }
}

run();
