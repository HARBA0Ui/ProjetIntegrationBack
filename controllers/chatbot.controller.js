import { API_KEY } from '../config/gemini.js';

import { GoogleGenAI } from "@google/genai";
const ai = new GoogleGenAI({ apiKey: API_KEY });


export const handleMessage = async (req, res) => {
  try{
    const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: req.body.message,
  });
  res.status(200).json({message: response.text})

  }catch(err){
    res.status(500).json({message: "500!!"})
  }
}


