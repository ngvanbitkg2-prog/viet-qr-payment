'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { useBanks } from '@/hooks/useBanks';
import { paymentAPI } from '@/lib/api';
import { Bank } from '@/types';
import BankSelector from '@/components/BankSelector';
import TransactionForm from '@/components/TransactionForm';
import QRDisplay from '@/components/QRDisplay';

export default function NapTienPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const { banks, isLoading: banksLoading } = useBanks();

  const [selectedBank, setSelectedBank] = useState<Bank | null>(null);
  const [qrData, setQrData] = useState<any>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  const handleCreateQR = async (points: number) => {
    if (!selectedBank) return;

    setIsCreating(true);
    setError('');

    try {
      const response = await paymentAPI.createQR(selectedBank.id, points);
      setQrData(response);
    } catch (err: any) {
      setError(err.message || 'Đã xảy ra lỗi');
    } finally {
      setIsCreating(false);
    }
  };

  const handleReset = () => {
    setQrData(null);
    setSelectedBank(null);
  };

  if (authLoading || banksLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Nạp tiền</h1>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {qrData ? (
        <div className="space-y-6">
          <QRDisplay
            qrUrl={qrData.qrUrl}
            amount={qrData.transaction.amount}
            points={qrData.transaction.points}
            transferContent={qrData.transaction.transferContent}
            bankName={qrData.transaction.bank.bankName}
            accountNumber={qrData.transaction.bank.accountNumber}
            accountName={qrData.transaction.bank.accountName}
          />
          <div className="text-center">
            <button
              onClick={handleReset}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Tạo giao dịch mới
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">1. Chọn ngân hàng</h2>
            {banks.length > 0 ? (
              <BankSelector
                banks={banks}
                selectedBank={selectedBank}
                onSelect={setSelectedBank}
              />
            ) : (
              <p className="text-gray-500">Không có ngân hàng khả dụng</p>
            )}
          </div>

          {selectedBank && (
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">2. Nhập số điểm</h2>
              <TransactionForm
                onSubmit={handleCreateQR}
                isLoading={isCreating}
                disabled={!selectedBank}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
