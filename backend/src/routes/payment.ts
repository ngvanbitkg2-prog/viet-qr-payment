import { Router } from 'express';
import { createQR, getMyTransactions } from '../controllers/paymentController';

const router = Router();

// Public routes - no auth required
router.post('/create-qr', createQR);
router.get('/my-transactions', getMyTransactions);

export default router;
