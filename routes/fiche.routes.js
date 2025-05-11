import express from 'express';
import multer from 'multer';
import { createFicheWithUpload,
    getFichesByUser,
    getFicheById,
    updateFiche,
    deleteFiche
 } from "../controllers/fiche.controller.js"

const router = express.Router();

const upload = multer({ dest: 'uploads/' });

router.post('', upload.single('file'), createFicheWithUpload);
router.get('/user/:userId', getFichesByUser);
router.get('/:ficheId', getFicheById);
router.put('/:ficheId', updateFiche);
router.delete('/:ficheId', deleteFiche);

export default router;
