'use client';

import { useState, useEffect } from 'react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { Bank } from '@/types';

interface BankFormProps {
  bank?: Bank | null;
  onSubmit: (data: { bankCode: string; bankName: string; accountNumber: string; accountName: string }) => void;
  onCancel: () => void;
  isLoading: boolean;
}

export default function BankForm({ bank, onSubmit, onCancel, isLoading }: BankFormProps) {
  const [formData, setFormData] = useState({
    bankCode: '',
    bankName: '',
    accountNumber: '',
    accountName: '',
  });

  useEffect(() => {
    if (bank) {
      setFormData({
        bankCode: bank.bankCode,
        bankName: bank.bankName,
        accountNumber: bank.accountNumber,
        accountName: bank.accountName,
      });
    }
  }, [bank]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Mã ngân hàng"
        placeholder="VD: VPB, VCB, TCB..."
        value={formData.bankCode}
        onChange={(e) => setFormData({ ...formData, bankCode: e.target.value })}
        required
      />
      <Input
        label="Tên ngân hàng"
        placeholder="VD: VPBank, Vietcombank..."
        value={formData.bankName}
        onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
        required
      />
      <Input
        label="Số tài khoản"
        placeholder="Nhập số tài khoản"
        value={formData.accountNumber}
        onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
        required
      />
      <Input
        label="Chủ tài khoản"
        placeholder="Nhập tên chủ tài khoản"
        value={formData.accountName}
        onChange={(e) => setFormData({ ...formData, accountName: e.target.value.toUpperCase() })}
        required
      />
      <div className="flex gap-2 justify-end pt-4">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Hủy
        </Button>
        <Button type="submit" isLoading={isLoading}>
          {bank ? 'Cập nhật' : 'Thêm mới'}
        </Button>
      </div>
    </form>
  );
}
