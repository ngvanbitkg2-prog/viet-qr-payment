'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { adminAPI } from '@/lib/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalBanks: 0,
    activeBanks: 0,
    totalTransactions: 0,
    pendingTransactions: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      adminAPI.getAllBanks(),
      adminAPI.getAllTransactions(),
    ])
      .then(([banks, transactions]) => {
        setStats({
          totalBanks: banks.length,
          activeBanks: banks.filter((b: any) => b.isActive).length,
          totalTransactions: transactions.length,
          pendingTransactions: transactions.filter((t: any) => t.status === 'PENDING').length,
        });
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Tổng ngân hàng',
      value: stats.totalBanks,
      href: '/admin/banks',
      color: 'bg-blue-500',
    },
    {
      title: 'Ngân hàng hoạt động',
      value: stats.activeBanks,
      href: '/admin/banks',
      color: 'bg-green-500',
    },
    {
      title: 'Tổng giao dịch',
      value: stats.totalTransactions,
      href: '/admin/transactions',
      color: 'bg-purple-500',
    },
    {
      title: 'Giao dịch chờ xử lý',
      value: stats.pendingTransactions,
      href: '/admin/transactions',
      color: 'bg-yellow-500',
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card) => (
          <Link
            key={card.title}
            href={card.href}
            className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
          >
            <div className={`w-12 h-12 ${card.color} rounded-lg flex items-center justify-center mb-4`}>
              <span className="text-2xl font-bold text-white">{card.value}</span>
            </div>
            <h3 className="text-gray-600 font-medium">{card.title}</h3>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Thao tác nhanh</h2>
          <div className="space-y-2">
            <Link
              href="/admin/banks"
              className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Quản lý ngân hàng
            </Link>
            <Link
              href="/admin/transactions"
              className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Xem giao dịch chờ xử lý
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Hướng dẫn</h2>
          <ul className="space-y-2 text-gray-600">
            <li>1. Thêm ngân hàng vào hệ thống</li>
            <li>2. User tạo QR và chuyển khoản</li>
            <li>3. Kiểm tra nội dung CK và xác nhận giao dịch</li>
            <li>4. Điểm sẽ được cộng vào tài khoản user</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
