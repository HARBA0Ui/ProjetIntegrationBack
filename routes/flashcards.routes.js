import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware.js';
import {
  createSet,
  getUserSets,
  deleteSet,
  addCardToSet,
  updateCard,
  recordAttempt,
  getSetStatistics
} from '../controllers/flashcards.controller.js'

const router = Router();

router.use(authenticate);

router.post('/sets', createSet);
router.get('/sets', getUserSets);
router.delete('/sets/:setId', deleteSet);

router.post('/sets/:setId/cards', addCardToSet);
router.patch('/cards/:cardId', updateCard);

router.post('/cards/:cardId/attempt', recordAttempt);
router.get('/sets/:setId/stats', getSetStatistics);

export default router;