import { Request, Response } from 'express';
import prisma from '../config/database';
import { generateVietQRUrl, calculateAmount } from '../services/qrService';
import { generateTransferContent } from '../utils/randomString';

export async function createQR(req: Request, res: Response) {
  try {
    const { bankId, points } = req.body;

    if (!bankId || !points) {
      return res.status(400).json({ error: 'Bank ID and points are required' });
    }

    if (points < 1) {
      return res.status(400).json({ error: 'Points must be at least 1' });
    }

    const bank = await prisma.bank.findFirst({
      where: { id: bankId, isActive: true },
    });

    if (!bank) {
      return res.status(404).json({ error: 'Bank not found or inactive' });
    }

    const amount = calculateAmount(points);
    const transferContent = generateTransferContent();

    // Create transaction without user (guest transaction)
    const transaction = await prisma.transaction.create({
      data: {
        userId: 1, // Default guest user ID (admin for now, can create a guest user)
        bankId: bank.id,
        amount,
        points,
        transferContent,
        status: 'PENDING',
      },
      include: {
        bank: {
          select: {
            bankCode: true,
            bankName: true,
            accountNumber: true,
            accountName: true,
          },
        },
      },
    });

    const qrUrl = generateVietQRUrl({
      bankCode: bank.bankCode,
      accountNumber: bank.accountNumber,
      accountName: bank.accountName,
      amount,
      transferContent,
    });

    return res.json({
      transaction: {
        id: transaction.id,
        amount: transaction.amount,
        points: transaction.points,
        transferContent: transaction.transferContent,
        status: transaction.status,
        createdAt: transaction.createdAt,
        bank: transaction.bank,
      },
      qrUrl,
    });
  } catch (error) {
    console.error('Create QR error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

export async function getMyTransactions(req: Request, res: Response) {
  try {
    const transactions = await prisma.transaction.findMany({
      include: {
        bank: {
          select: {
            bankName: true,
            accountNumber: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return res.json(transactions);
  } catch (error) {
    console.error('Get transactions error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
