// routes/admin.routes.js
import { Router } from 'express';
import { authenticate, requireAdmin } from '../middlewares/auth.middleware.js';
import { getUsers, deleteUser } from '../controllers/admin.controller.js';

const router = Router();

router.use(authenticate, requireAdmin); // All admin routes require ADMIN role

router.get('/users', getUsers);
router.delete('/users/:id', deleteUser);

export default router;