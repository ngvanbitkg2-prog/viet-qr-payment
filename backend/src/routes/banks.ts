import { Router } from 'express';
import { getActiveBanks } from '../controllers/bankController';

const router = Router();

router.get('/', getActiveBanks);

export default router;
