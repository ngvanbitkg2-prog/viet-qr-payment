export interface User {
  id: number;
  username: string;
  balance: number;
  role: 'USER' | 'ADMIN';
}

export interface Bank {
  id: number;
  bankCode: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  isActive?: boolean;
  createdAt?: string;
}

export interface Transaction {
  id: number;
  userId: number;
  bankId: number;
  amount: number;
  points: number;
  transferContent: string;
  status: 'PENDING' | 'SUCCESS' | 'FAILED';
  createdAt: string;
  confirmedAt?: string;
  bank: {
    bankName: string;
    accountNumber: string;
  };
  user?: {
    id: number;
    username: string;
  };
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface CreateQRResponse {
  transaction: {
    id: number;
    amount: number;
    points: number;
    transferContent: string;
    status: string;
    createdAt: string;
    bank: Bank;
  };
  qrUrl: string;
}
