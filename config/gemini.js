export const API_KEY = process.env.GEMINI_API_KEY;
export const GEMINI_API = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`