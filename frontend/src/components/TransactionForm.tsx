'use client';

import { useState } from 'react';

interface TransactionFormProps {
  onSubmit: (points: number) => void;
  isLoading: boolean;
  disabled: boolean;
}

export default function TransactionForm({ onSubmit, isLoading, disabled }: TransactionFormProps) {
  const [amount, setAmount] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseInt(amount);
    if (amountNum >= 10000) {
      const points = Math.floor(amountNum / 1000);
      onSubmit(points);
    }
  };

  const amountNum = parseInt(amount) || 0;
  const points = Math.floor(amountNum / 1000);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN').format(value);
  };

  const quickOptions = [50000, 100000, 200000, 500000, 1000000, 2000000];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Amount Input */}
      <div>
        <label className="block text-text-secondary text-sm font-medium mb-2">
          Số tiền muốn nạp (VNĐ)
        </label>
        <div className="relative">
          <input
            type="number"
            placeholder="Nhập số tiền..."
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min="10000"
            step="1000"
            className="w-full bg-dark-700 border-2 border-dark-500 rounded-xl px-4 py-4 text-white text-lg font-medium placeholder-text-disabled focus:border-gold-500 transition-colors"
            disabled={disabled}
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted font-medium">
            VNĐ
          </span>
        </div>
        {amountNum > 0 && amountNum < 10000 && (
          <p className="mt-2 text-sm text-red-400">Số tiền tối thiểu là 10,000 VNĐ</p>
        )}
        {amountNum >= 10000 && (
          <p className="mt-2 text-sm text-text-secondary">
            Bạn sẽ nhận được <span className="font-bold text-gold-500">{formatCurrency(points)} điểm</span>
          </p>
        )}
      </div>

      {/* Quick Options */}
      <div>
        <label className="block text-text-secondary text-sm font-medium mb-3">
          Chọn nhanh
        </label>
        <div className="grid grid-cols-3 gap-2">
          {quickOptions.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setAmount(option.toString())}
              disabled={disabled}
              className={`py-3 px-2 text-sm font-medium rounded-xl border-2 transition-all ${
                amount === option.toString()
                  ? 'bg-gold-500 border-gold-500 text-dark-900'
                  : 'bg-dark-700 border-dark-500 text-text-secondary hover:border-gold-500/50 hover:text-white'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {formatCurrency(option)}
            </button>
          ))}
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={disabled || amountNum < 10000 || isLoading}
        className="w-full py-4 px-6 bg-gradient-gold text-dark-900 font-bold text-lg rounded-xl shadow-gold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <div className="w-5 h-5 border-2 border-dark-900/30 border-t-dark-900 rounded-full animate-spin"></div>
            Đang tạo mã QR...
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"/>
            </svg>
            Tạo mã QR
          </>
        )}
      </button>
    </form>
  );
}
