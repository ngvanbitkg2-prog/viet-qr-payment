'use client';

import { Bank } from '@/types';
import Button from '../ui/Button';

interface BankTableProps {
  banks: Bank[];
  onEdit: (bank: Bank) => void;
  onDelete: (bank: Bank) => void;
  onToggle: (bank: Bank) => void;
}

export default function BankTable({ banks, onEdit, onDelete, onToggle }: BankTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mã NH</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tên NH</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Số TK</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Chủ TK</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thao tác</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {banks.length === 0 ? (
            <tr>
              <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                Chưa có ngân hàng nào
              </td>
            </tr>
          ) : (
            banks.map((bank) => (
              <tr key={bank.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{bank.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{bank.bankCode}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{bank.bankName}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{bank.accountNumber}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{bank.accountName}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      bank.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {bank.isActive ? 'Hoạt động' : 'Tắt'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                  <Button size="sm" variant="secondary" onClick={() => onEdit(bank)}>
                    Sửa
                  </Button>
                  <Button
                    size="sm"
                    variant={bank.isActive ? 'danger' : 'success'}
                    onClick={() => onToggle(bank)}
                  >
                    {bank.isActive ? 'Tắt' : 'Bật'}
                  </Button>
                  <Button size="sm" variant="danger" onClick={() => onDelete(bank)}>
                    Xóa
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
