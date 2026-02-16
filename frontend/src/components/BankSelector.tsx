'use client';

import Image from 'next/image';
import { Bank } from '@/types';

interface BankSelectorProps {
  banks: Bank[];
  selectedBank: Bank | null;
  onSelect: (bank: Bank) => void;
}

// Bank logo images
const bankLogos: Record<string, string> = {
  VIB: 'https://yt3.googleusercontent.com/ytc/AIdro_kV3OPLbXdBimChtx8eKNtNRu4w3vQ5iaAxeUT7SzRBLzA=s900-c-k-c0x00ffffff-no-rj',
  VPB: 'https://yt3.googleusercontent.com/_uwwTxJP2A_IA_MwU5fkDIcsLOXW1SmqNKfAxJZmVudOwp29NuPlm69So0P7I0B3s78X-5syQQ=s900-c-k-c0x00ffffff-no-rj',
};

export default function BankSelector({ banks, selectedBank, onSelect }: BankSelectorProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {banks.map((bank) => {
        const isSelected = selectedBank?.id === bank.id;
        const logoUrl = bankLogos[bank.bankCode];

        return (
          <button
            key={bank.id}
            onClick={() => onSelect(bank)}
            className={`relative p-4 rounded-xl text-left transition-all duration-200 border-2 ${
              isSelected
                ? 'bg-dark-500 border-gold-500 shadow-gold'
                : 'bg-dark-700 border-dark-500 hover:border-dark-400 hover:bg-dark-600'
            }`}
          >
            {/* Selected indicator */}
            {isSelected && (
              <div className="absolute top-3 right-3">
                <div className="w-6 h-6 bg-gold-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-dark-900" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                </div>
              </div>
            )}

            <div className="flex items-center gap-4">
              {/* Bank Logo */}
              <div className="w-14 h-14 rounded-xl overflow-hidden bg-white flex items-center justify-center shadow-md flex-shrink-0">
                {logoUrl ? (
                  <Image
                    src={logoUrl}
                    alt={bank.bankName}
                    width={56}
                    height={56}
                    className="w-full h-full object-cover"
                    unoptimized
                  />
                ) : (
                  <span className="font-bold text-lg text-dark-900">{bank.bankCode}</span>
                )}
              </div>

              {/* Bank Info */}
              <div className="flex-1 min-w-0">
                <div className={`font-semibold text-lg ${isSelected ? 'text-gold-500' : 'text-white'}`}>
                  {bank.bankName}
                </div>
                <div className="text-text-secondary text-sm mt-1 truncate">
                  {bank.accountNumber}
                </div>
                <div className="text-text-muted text-xs mt-0.5 truncate">
                  {bank.accountName}
                </div>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
