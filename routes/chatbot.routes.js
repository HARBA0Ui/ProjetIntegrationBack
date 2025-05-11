import express from 'express';
import {handleMessage} from "../controllers/chatbot.controller.js"
import { authenticate } from '../middlewares/auth.middleware.js';


const router = express.Router();

router.post('/message', handleMessage);

export default router;