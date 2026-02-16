import { Router } from 'express';
import { authMiddleware, adminMiddleware } from '../middleware/auth';
import {
  getAllBanks,
  createBank,
  updateBank,
  deleteBank,
  toggleBank,
  getAllTransactions,
  confirmTransaction,
  rejectTransaction,
} from '../controllers/adminController';

const router = Router();

// Apply auth and admin middleware to all routes
router.use(authMiddleware);
router.use(adminMiddleware);

// Bank routes
router.get('/banks', getAllBanks);
router.post('/banks', createBank);
router.put('/banks/:id', updateBank);
router.delete('/banks/:id', deleteBank);
router.patch('/banks/:id/toggle', toggleBank);

// Transaction routes
router.get('/transactions', getAllTransactions);
router.post('/transactions/:id/confirm', confirmTransaction);
router.post('/transactions/:id/reject', rejectTransaction);

export default router;
