'use client';

import { useState, useEffect } from 'react';
import { adminAPI } from '@/lib/api';
import { Bank } from '@/types';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import BankForm from '@/components/admin/BankForm';
import BankTable from '@/components/admin/BankTable';

export default function AdminBanksPage() {
  const [banks, setBanks] = useState<Bank[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBank, setEditingBank] = useState<Bank | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchBanks = async () => {
    try {
      const data = await adminAPI.getAllBanks();
      setBanks(data);
    } catch (error) {
      console.error('Failed to fetch banks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBanks();
  }, []);

  const handleOpenModal = (bank?: Bank) => {
    setEditingBank(bank || null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingBank(null);
  };

  const handleSubmit = async (data: { bankCode: string; bankName: string; accountNumber: string; accountName: string }) => {
    setIsSubmitting(true);
    try {
      if (editingBank) {
        await adminAPI.updateBank(editingBank.id, data);
      } else {
        await adminAPI.createBank(data);
      }
      await fetchBanks();
      handleCloseModal();
    } catch (error) {
      console.error('Failed to save bank:', error);
      alert('Đã xảy ra lỗi');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (bank: Bank) => {
    if (!confirm(`Bạn có chắc muốn xóa ngân hàng ${bank.bankName}?`)) {
      return;
    }

    try {
      await adminAPI.deleteBank(bank.id);
      await fetchBanks();
    } catch (error) {
      console.error('Failed to delete bank:', error);
      alert('Đã xảy ra lỗi');
    }
  };

  const handleToggle = async (bank: Bank) => {
    try {
      await adminAPI.toggleBank(bank.id);
      await fetchBanks();
    } catch (error) {
      console.error('Failed to toggle bank:', error);
      alert('Đã xảy ra lỗi');
    }
  };

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
        <h1 className="text-2xl font-bold text-gray-900">Quản lý ngân hàng</h1>
        <Button onClick={() => handleOpenModal()}>Thêm ngân hàng</Button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <BankTable
          banks={banks}
          onEdit={handleOpenModal}
          onDelete={handleDelete}
          onToggle={handleToggle}
        />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingBank ? 'Sửa ngân hàng' : 'Thêm ngân hàng'}
      >
        <BankForm
          bank={editingBank}
          onSubmit={handleSubmit}
          onCancel={handleCloseModal}
          isLoading={isSubmitting}
        />
      </Modal>
    </div>
  );
}
