import express from 'express';
import multer from 'multer';
import * as ficheController from './controllers/ficheController'; 

const router = express.Router();

const upload = multer({ dest: 'uploads/' });

router.post('/fiches', upload.single('file'), ficheController.createFicheWithUpload);
router.get('/fiches/user/:userId', ficheController.getFichesByUser);
router.get('/fiches/:ficheId', ficheController.getFicheById);
router.put('/fiches/:ficheId', ficheController.updateFiche);
router.delete('/fiches/:ficheId', ficheController.deleteFiche);

export default router;
