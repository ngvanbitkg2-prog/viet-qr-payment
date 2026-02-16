'use client';

import { useState, useEffect } from 'react';
import { bankAPI, paymentAPI } from '@/lib/api';
import { Bank } from '@/types';
import BankSelector from '@/components/BankSelector';
import TransactionForm from '@/components/TransactionForm';
import QRDisplay from '@/components/QRDisplay';

type DepositTab = 'online' | 'usdt';
type PaymentMethod = 'vip-qr' | 'bank-qr' | 'momo' | 'card';

export default function HomePage() {
  // Tab states
  const [activeTab, setActiveTab] = useState<DepositTab>('online');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('bank-qr');

  // Data states
  const [banks, setBanks] = useState<Bank[]>([]);
  const [selectedBank, setSelectedBank] = useState<Bank | null>(null);
  const [qrData, setQrData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    bankAPI.getActiveBanks()
      .then(setBanks)
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, []);

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

  const depositTabs = [
    { id: 'online' as DepositTab, label: 'NẠP TRỰC TUYẾN' },
    { id: 'usdt' as DepositTab, label: 'NẠP THƯỜNG - USDT' },
  ];

  const paymentMethods = [
    { id: 'vip-qr' as PaymentMethod, label: 'VIP QR' },
    { id: 'bank-qr' as PaymentMethod, label: 'QUÉT MÃ QR NGÂN HÀNG' },
    { id: 'momo' as PaymentMethod, label: 'MOMO' },
    { id: 'card' as PaymentMethod, label: 'THẺ CÀO' },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-dark-400 border-t-gold-500 rounded-full animate-spin"></div>
          <p className="text-text-secondary">Đang tải...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-dark-800 border-b border-dark-500">
        {/* Logo - căn giữa */}
        <div className="py-4 flex justify-center">
          <img
            src="https://fg8bhj08.com/file/picture/7f766ee2-cd51-4ab2-ab1b-a9a138937619"
            alt="Logo"
            className="h-12 object-contain"
          />
        </div>

        {/* Deposit Tabs - căn giữa */}
        <div className="flex justify-center gap-1 px-4">
          {depositTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 font-semibold text-sm rounded-t-xl transition-colors ${
                activeTab === tab.id
                  ? 'bg-gold-500 text-dark-900'
                  : 'bg-dark-600 text-text-secondary hover:bg-dark-500 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      {/* Payment Methods - căn giữa */}
      <div className="bg-dark-700 border-b border-dark-500">
        <div className="py-3 px-4">
          <div className="flex justify-center flex-wrap gap-2">
            {paymentMethods.map((method) => (
              <button
                key={method.id}
                onClick={() => setPaymentMethod(method.id)}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                  paymentMethod === method.id
                    ? 'bg-gold-500 text-dark-900 shadow-gold'
                    : 'bg-dark-600 text-text-secondary hover:bg-dark-500 hover:text-white border border-dark-500'
                }`}
              >
                {method.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="py-6 px-4">
        <div className="max-w-3xl mx-auto">
          {error && (
            <div className="mb-6 bg-red-900/30 border border-red-500/50 text-red-300 px-4 py-3 rounded-xl">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                </svg>
                {error}
              </div>
            </div>
          )}

          {/* Show content based on active tab and payment method */}
          {activeTab === 'online' && paymentMethod === 'bank-qr' && (
            <>
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
                      className="inline-flex items-center gap-2 text-gold-500 hover:text-gold-400 font-medium transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
                      </svg>
                      Tạo giao dịch mới
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-dark-600 rounded-2xl shadow-card p-6 md:p-8 border border-dark-400">
                  {/* Step 1: Select Bank */}
                  <div className="mb-8">
                    <div className="flex items-center gap-3 mb-5">
                      <span className="flex items-center justify-center w-10 h-10 bg-gradient-gold text-dark-900 rounded-xl font-bold text-lg">1</span>
                      <h2 className="text-xl font-semibold text-white">Chọn ngân hàng</h2>
                    </div>
                    {banks.length > 0 ? (
                      <BankSelector
                        banks={banks}
                        selectedBank={selectedBank}
                        onSelect={setSelectedBank}
                      />
                    ) : (
                      <div className="text-center py-8 text-text-muted">
                        <svg className="w-12 h-12 mx-auto mb-3 text-dark-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                        </svg>
                        Không có ngân hàng khả dụng
                      </div>
                    )}
                  </div>

                  {/* Step 2: Enter Amount */}
                  <div className={`transition-all duration-300 ${selectedBank ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
                    <div className="flex items-center gap-3 mb-5">
                      <span className={`flex items-center justify-center w-10 h-10 rounded-xl font-bold text-lg ${selectedBank ? 'bg-gradient-gold text-dark-900' : 'bg-dark-500 text-text-disabled'}`}>2</span>
                      <h2 className={`text-xl font-semibold ${selectedBank ? 'text-white' : 'text-text-disabled'}`}>Nhập số tiền</h2>
                    </div>
                    <TransactionForm
                      onSubmit={handleCreateQR}
                      isLoading={isCreating}
                      disabled={!selectedBank}
                    />
                  </div>
                </div>
              )}
            </>
          )}

          {/* Placeholder for other payment methods */}
          {activeTab === 'online' && paymentMethod === 'vip-qr' && (
            <div className="bg-dark-600 rounded-2xl p-8 border border-dark-400 text-center">
              <div className="w-16 h-16 bg-gold-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gold-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">VIP QR</h3>
              <p className="text-text-secondary">Tính năng đang được phát triển</p>
            </div>
          )}

          {activeTab === 'online' && paymentMethod === 'momo' && (
            <div className="bg-dark-600 rounded-2xl p-8 border border-dark-400 text-center">
              <div className="w-16 h-16 bg-pink-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-pink-500">M</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">MOMO</h3>
              <p className="text-text-secondary">Tính năng đang được phát triển</p>
            </div>
          )}

          {activeTab === 'online' && paymentMethod === 'card' && (
            <div className="bg-dark-600 rounded-2xl p-8 border border-dark-400 text-center">
              <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">THẺ CÀO</h3>
              <p className="text-text-secondary">Tính năng đang được phát triển</p>
            </div>
          )}

          {activeTab === 'usdt' && (
            <div className="bg-dark-600 rounded-2xl p-8 border border-dark-400 text-center">
              <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-500">₮</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">NẠP THƯỜNG - USDT</h3>
              <p className="text-text-secondary">Tính năng đang được phát triển</p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-text-disabled text-sm border-t border-dark-700">
        © 2024 VietQR Payment. All rights reserved.
      </footer>
    </div>
  );
}
