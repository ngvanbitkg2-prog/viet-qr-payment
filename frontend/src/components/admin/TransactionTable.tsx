'use client';

import { Transaction } from '@/types';
import Button from '../ui/Button';

interface TransactionTableProps {
  transactions: Transaction[];
  onConfirm: (transaction: Transaction) => void;
  onReject: (transaction: Transaction) => void;
}

export default function TransactionTable({ transactions, onConfirm, onReject }: TransactionTableProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN');
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      SUCCESS: 'bg-green-100 text-green-800',
      FAILED: 'bg-red-100 text-red-800',
    };
    const labels = {
      PENDING: 'Chờ xử lý',
      SUCCESS: 'Thành công',
      FAILED: 'Thất bại',
    };
    return (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ngân hàng</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Số tiền</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Điểm</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nội dung CK</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ngày tạo</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thao tác</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {transactions.length === 0 ? (
            <tr>
              <td colSpan={9} className="px-6 py-4 text-center text-gray-500">
                Chưa có giao dịch nào
              </td>
            </tr>
          ) : (
            transactions.map((tx) => (
              <tr key={tx.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{tx.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{tx.user?.username}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{tx.bank.bankName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                  {formatCurrency(tx.amount)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                  {tx.points.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-red-600">
                  {tx.transferContent}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(tx.status)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(tx.createdAt)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                  {tx.status === 'PENDING' ? (
                    <>
                      <Button size="sm" variant="success" onClick={() => onConfirm(tx)}>
                        Xác nhận
                      </Button>
                      <Button size="sm" variant="danger" onClick={() => onReject(tx)}>
                        Từ chối
                      </Button>
                    </>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
