import { Request, Response } from 'express';
import prisma from '../config/database';

export async function getActiveBanks(req: Request, res: Response) {
  try {
    const banks = await prisma.bank.findMany({
      where: { isActive: true },
      select: {
        id: true,
        bankCode: true,
        bankName: true,
        accountNumber: true,
        accountName: true,
      },
      orderBy: { bankName: 'asc' },
    });

    return res.json(banks);
  } catch (error) {
    console.error('Get banks error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
