'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';

interface QRDisplayProps {
  qrUrl: string;
  amount: number;
  points: number;
  transferContent: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
}

export default function QRDisplay({
  qrUrl,
  amount,
  transferContent,
  bankName,
  accountNumber,
  accountName,
}: QRDisplayProps) {
  // Countdown timer - 15 minutes
  const [timeLeft, setTimeLeft] = useState(15 * 60);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0) {
      setIsExpired(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN').format(value);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleSaveQR = () => {
    const link = document.createElement('a');
    link.href = qrUrl;
    link.download = `QR_${transferContent}.png`;
    link.click();
  };

  const transferInfo = [
    { label: 'Ngân hàng', value: bankName },
    { label: 'Chủ tài khoản', value: accountName },
    { label: 'Số tài khoản', value: accountNumber },
    { label: 'Nội dung', value: transferContent, highlight: true },
    { label: 'Số tiền nạp', value: `${formatCurrency(amount)} VND`, highlight: true },
  ];

  // If expired, show expired message
  if (isExpired) {
    return (
      <div className="w-full max-w-3xl mx-auto">
        <div className="bg-dark-700 border-2 border-red-500 rounded-2xl p-8 text-center">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <h3 className="text-xl font-bold text-red-500 mb-2">Mã QR đã hết hiệu lực</h3>
          <p className="text-text-secondary mb-6">Vui lòng tạo giao dịch mới để tiếp tục nạp tiền.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Main Container with gold border */}
      <div className="bg-dark-700 border-2 border-gold-500 rounded-2xl overflow-hidden">
        {/* Two columns layout */}
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left Column - QR Code */}
          <div className="p-6 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-dark-500">
            {/* QR Code */}
            <div className="bg-white p-3 rounded-xl shadow-lg">
              <Image
                src={qrUrl}
                alt="VietQR Payment"
                width={220}
                height={220}
                className="rounded-lg"
                unoptimized
              />
            </div>

            {/* Save QR Button */}
            <button
              onClick={handleSaveQR}
              className="mt-4 w-full max-w-[220px] py-3 bg-gold-500 hover:bg-gold-400 text-dark-900 font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
              </svg>
              LƯU MÃ QR
            </button>

            {/* Amount */}
            <div className="mt-4 text-2xl font-bold text-gold-500">
              {formatCurrency(amount)} VND
            </div>
          </div>

          {/* Right Column - Transfer Info */}
          <div className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Thông tin chuyển khoản</h3>

            <div className="space-y-4">
              {transferInfo.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="text-text-secondary text-sm">{item.label}</div>
                    <div className={`font-semibold ${item.highlight ? 'text-gold-500' : 'text-white'}`}>
                      {item.value}
                    </div>
                  </div>
                  <button
                    onClick={() => copyToClipboard(item.value.toString())}
                    className="ml-3 p-2 text-text-muted hover:text-gold-500 transition-colors"
                    title="Copy"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom - Countdown Timer */}
        <div className="border-t border-dark-500 px-6 py-4">
          <div className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5 text-gold-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <span className="text-text-secondary">Thời gian thanh toán còn lại:</span>
            <span className={`font-bold text-lg ${timeLeft < 60 ? 'text-red-500 animate-pulse' : 'text-gold-500'}`}>
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>
      </div>

      {/* Notes Section */}
      <div className="mt-4 bg-dark-700 border border-dark-500 rounded-2xl p-5">
        <h4 className="text-gold-500 font-semibold mb-3 flex items-center gap-2">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
          </svg>
          Lưu ý:
        </h4>
        <ol className="space-y-2 text-sm text-text-secondary">
          <li className="flex gap-2">
            <span className="text-gold-500 font-medium">1.</span>
            <span>Vui lòng chọn hình thức <strong className="text-white">chuyển khoản nhanh 24/7</strong>.</span>
          </li>
          <li className="flex gap-2">
            <span className="text-gold-500 font-medium">2.</span>
            <span>Vui lòng điền chính xác <strong className="text-white">SỐ TÀI KHOẢN</strong>, <strong className="text-white">SỐ TIỀN</strong> và <strong className="text-white">NỘI DUNG CHUYỂN KHOẢN</strong> được hiển thị trên màn hình.</span>
          </li>
          <li className="flex gap-2">
            <span className="text-gold-500 font-medium">3.</span>
            <span>Nếu quét mã quý khách vui lòng <strong className="text-white">KHÔNG chỉnh sửa</strong> bất cứ thông tin nào.</span>
          </li>
          <li className="flex gap-2">
            <span className="text-gold-500 font-medium">4.</span>
            <span>Kiểm tra và đảm bảo mọi thông tin đều chính xác trước khi xác nhận chuyển tiền.</span>
          </li>
          <li className="flex gap-2">
            <span className="text-gold-500 font-medium">5.</span>
            <span>Lưu lại biên lai giao dịch để đối chiếu khi cần thiết.</span>
          </li>
          <li className="flex gap-2">
            <span className="text-gold-500 font-medium">6.</span>
            <span>Khi chuyển khoản vui lòng <strong className="text-white">KHÔNG làm mới trình duyệt</strong> trước khi có thông báo giao dịch thành công.</span>
          </li>
        </ol>
      </div>
    </div>
  );
}
