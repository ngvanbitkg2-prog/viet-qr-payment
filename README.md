# VietQR Payment Website

Website nạp tiền sử dụng QR ngân hàng thông qua VietQR, với admin dashboard quản lý.

## Tech Stack

- **Frontend**: Next.js 14 + TailwindCSS
- **Backend**: Express.js + TypeScript
- **Database**: MySQL (với Prisma ORM)
- **Auth**: JWT
- **Deployment**: Docker + docker-compose

## Cài đặt và Chạy

### Yêu cầu
- Docker & Docker Compose
- Node.js 18+ (nếu chạy local)

### Chạy với Docker

```bash
# Clone project
cd viet-qr

# Chạy toàn bộ stack
docker-compose up --build

# Hoặc chạy từng service
docker-compose up -d mysql
docker-compose up -d backend
docker-compose up -d frontend
```

### Chạy Local (Development)

#### Backend
```bash
cd backend
npm install
npx prisma generate
npx prisma db push
npx prisma db seed
npm run dev
```

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Truy cập

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:4000/api
- **Admin Dashboard**: http://localhost:3000/admin

## Tài khoản mặc định

### Admin
- Username: `admin`
- Password: `admin123`

## API Endpoints

| Method | Endpoint | Auth | Mô tả |
|--------|----------|------|-------|
| POST | /api/auth/login | No | Đăng nhập |
| POST | /api/auth/register | No | Đăng ký |
| GET | /api/banks | No | Lấy danh sách bank ACTIVE |
| POST | /api/payment/create-qr | User | Tạo QR nạp tiền |
| GET | /api/payment/my-transactions | User | Lịch sử GD của user |
| GET | /api/admin/banks | Admin | Lấy tất cả banks |
| POST | /api/admin/banks | Admin | Thêm bank |
| PUT | /api/admin/banks/:id | Admin | Sửa bank |
| DELETE | /api/admin/banks/:id | Admin | Xoá bank |
| PATCH | /api/admin/banks/:id/toggle | Admin | Bật/tắt bank |
| GET | /api/admin/transactions | Admin | Tất cả giao dịch |
| POST | /api/admin/transactions/:id/confirm | Admin | Xác nhận + cộng điểm |

## VietQR URL Format

```
https://img.vietqr.io/image/{bankCode}-{accountNumber}-compact.png?amount={amount}&addInfo={transferContent}&accountName={accountName}
```

## Ngân hàng mẫu

1. **VPBank**: VPB, 0969185403, TRAN THI HUYEN TRANG
2. **VIB**: VIB, 086998950, NGUYEN KIEU THANH DIEM
