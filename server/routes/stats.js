import express from 'express';
import statsController from '../controllers/statsController.js';


const router = express.Router();


router.get('/summary', statsController.getStatsSummary);


export default router;


