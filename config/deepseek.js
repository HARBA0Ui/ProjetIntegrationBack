const axios = require('axios');

const DEEPSEEK_API = 'https://api.deepseek.com/v1/chat/completions'; // Check latest URL
const API_KEY = process.env.DEEPSEEK_API_KEY;

module.exports = { axios, DEEPSEEK_API, API_KEY };