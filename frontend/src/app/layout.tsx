import './globals.css';

export const metadata = {
  title: 'VietQR Payment',
  description: 'Nạp tiền qua QR ngân hàng',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
