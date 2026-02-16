export interface QRData {
  bankCode: string;
  accountNumber: string;
  accountName: string;
  amount: number;
  transferContent: string;
}

export function generateVietQRUrl(data: QRData): string {
  const { bankCode, accountNumber, accountName, amount, transferContent } = data;

  const encodedAccountName = encodeURIComponent(accountName);
  const encodedContent = encodeURIComponent(transferContent);

  return `https://img.vietqr.io/image/${bankCode}-${accountNumber}-qr_only.png?amount=${amount}&addInfo=${encodedContent}&accountName=${encodedAccountName}`;
}

export function calculatePoints(amount: number): number {
  // 1000 VND = 1 point
  return Math.floor(amount / 1000);
}

export function calculateAmount(points: number): number {
  // 1 point = 1000 VND
  return points * 1000;
}
