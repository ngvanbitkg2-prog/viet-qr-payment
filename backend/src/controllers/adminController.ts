import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import prisma from '../config/database';

// Bank Management
export async function getAllBanks(req: AuthRequest, res: Response) {
  try {
    const banks = await prisma.bank.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return res.json(banks);
  } catch (error) {
    console.error('Get all banks error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

export async function createBank(req: AuthRequest, res: Response) {
  try {
    const { bankCode, bankName, accountNumber, accountName } = req.body;

    if (!bankCode || !bankName || !accountNumber || !accountName) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const bank = await prisma.bank.create({
      data: {
        bankCode,
        bankName,
        accountNumber,
        accountName,
        isActive: true,
      },
    });

    await prisma.adminLog.create({
      data: {
        adminId: req.user!.userId,
        action: 'CREATE_BANK',
        data: JSON.stringify({ bankId: bank.id, bankName: bank.bankName }),
      },
    });

    return res.status(201).json(bank);
  } catch (error) {
    console.error('Create bank error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

export async function updateBank(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    const { bankCode, bankName, accountNumber, accountName } = req.body;

    const bank = await prisma.bank.update({
      where: { id: parseInt(id) },
      data: {
        bankCode,
        bankName,
        accountNumber,
        accountName,
      },
    });

    await prisma.adminLog.create({
      data: {
        adminId: req.user!.userId,
        action: 'UPDATE_BANK',
        data: JSON.stringify({ bankId: bank.id, bankName: bank.bankName }),
      },
    });

    return res.json(bank);
  } catch (error) {
    console.error('Update bank error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

export async function deleteBank(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;

    const bank = await prisma.bank.delete({
      where: { id: parseInt(id) },
    });

    await prisma.adminLog.create({
      data: {
        adminId: req.user!.userId,
        action: 'DELETE_BANK',
        data: JSON.stringify({ bankId: bank.id, bankName: bank.bankName }),
      },
    });

    return res.json({ message: 'Bank deleted successfully' });
  } catch (error) {
    console.error('Delete bank error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

export async function toggleBank(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;

    const currentBank = await prisma.bank.findUnique({
      where: { id: parseInt(id) },
    });

    if (!currentBank) {
      return res.status(404).json({ error: 'Bank not found' });
    }

    const bank = await prisma.bank.update({
      where: { id: parseInt(id) },
      data: { isActive: !currentBank.isActive },
    });

    await prisma.adminLog.create({
      data: {
        adminId: req.user!.userId,
        action: 'TOGGLE_BANK',
        data: JSON.stringify({ bankId: bank.id, isActive: bank.isActive }),
      },
    });

    return res.json(bank);
  } catch (error) {
    console.error('Toggle bank error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// Transaction Management
export async function getAllTransactions(req: AuthRequest, res: Response) {
  try {
    const transactions = await prisma.transaction.findMany({
      include: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
        bank: {
          select: {
            bankName: true,
            accountNumber: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return res.json(transactions);
  } catch (error) {
    console.error('Get all transactions error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

export async function confirmTransaction(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;

    const transaction = await prisma.transaction.findUnique({
      where: { id: parseInt(id) },
    });

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    if (transaction.status !== 'PENDING') {
      return res.status(400).json({ error: 'Transaction already processed' });
    }

    // Update transaction and user balance in a transaction
    const [updatedTransaction, updatedUser] = await prisma.$transaction([
      prisma.transaction.update({
        where: { id: parseInt(id) },
        data: {
          status: 'SUCCESS',
          confirmedAt: new Date(),
        },
      }),
      prisma.user.update({
        where: { id: transaction.userId },
        data: {
          balance: { increment: transaction.points },
        },
      }),
    ]);

    await prisma.adminLog.create({
      data: {
        adminId: req.user!.userId,
        action: 'CONFIRM_TRANSACTION',
        data: JSON.stringify({
          transactionId: transaction.id,
          points: transaction.points,
          userId: transaction.userId,
        }),
      },
    });

    return res.json({
      transaction: updatedTransaction,
      userBalance: updatedUser.balance,
    });
  } catch (error) {
    console.error('Confirm transaction error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

export async function rejectTransaction(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;

    const transaction = await prisma.transaction.findUnique({
      where: { id: parseInt(id) },
    });

    if (!transaction) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    if (transaction.status !== 'PENDING') {
      return res.status(400).json({ error: 'Transaction already processed' });
    }

    const updatedTransaction = await prisma.transaction.update({
      where: { id: parseInt(id) },
      data: {
        status: 'FAILED',
        confirmedAt: new Date(),
      },
    });

    await prisma.adminLog.create({
      data: {
        adminId: req.user!.userId,
        action: 'REJECT_TRANSACTION',
        data: JSON.stringify({
          transactionId: transaction.id,
        }),
      },
    });

    return res.json(updatedTransaction);
  } catch (error) {
    console.error('Reject transaction error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
