'use client';

import { useState, useEffect } from 'react';
import { adminAPI } from '@/lib/api';
import { Transaction } from '@/types';
import TransactionTable from '@/components/admin/TransactionTable';

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'success' | 'failed'>('all');

  const fetchTransactions = async () => {
    try {
      const data = await adminAPI.getAllTransactions();
      setTransactions(data);
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleConfirm = async (transaction: Transaction) => {
    if (!confirm(`Xác nhận giao dịch #${transaction.id} và cộng ${transaction.points} điểm cho user ${transaction.user?.username}?`)) {
      return;
    }

    try {
      await adminAPI.confirmTransaction(transaction.id);
      await fetchTransactions();
    } catch (error) {
      console.error('Failed to confirm transaction:', error);
      alert('Đã xảy ra lỗi');
    }
  };

  const handleReject = async (transaction: Transaction) => {
    if (!confirm(`Từ chối giao dịch #${transaction.id}?`)) {
      return;
    }

    try {
      await adminAPI.rejectTransaction(transaction.id);
      await fetchTransactions();
    } catch (error) {
      console.error('Failed to reject transaction:', error);
      alert('Đã xảy ra lỗi');
    }
  };

  const filteredTransactions = transactions.filter((tx) => {
    if (filter === 'all') return true;
    return tx.status === filter.toUpperCase();
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý giao dịch</h1>
        <div className="flex gap-2">
          {(['all', 'pending', 'success', 'failed'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 text-sm rounded-lg ${
                filter === f
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {f === 'all' && 'Tất cả'}
              {f === 'pending' && 'Chờ xử lý'}
              {f === 'success' && 'Thành công'}
              {f === 'failed' && 'Thất bại'}
              {f === 'pending' && ` (${transactions.filter((t) => t.status === 'PENDING').length})`}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <TransactionTable
          transactions={filteredTransactions}
          onConfirm={handleConfirm}
          onReject={handleReject}
        />
      </div>
    </div>
  );
}
