"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
async function main() {
    // Create admin user
    const adminPassword = await bcryptjs_1.default.hash('admin123', 10);
    const admin = await prisma.user.upsert({
        where: { username: 'admin' },
        update: {},
        create: {
            username: 'admin',
            password: adminPassword,
            role: 'ADMIN',
            balance: 0,
        },
    });
    console.log('Created admin user:', admin.username);
    // Create a test user
    const userPassword = await bcryptjs_1.default.hash('user123', 10);
    const testUser = await prisma.user.upsert({
        where: { username: 'testuser' },
        update: {},
        create: {
            username: 'testuser',
            password: userPassword,
            role: 'USER',
            balance: 0,
        },
    });
    console.log('Created test user:', testUser.username);
    // Create sample banks
    const existingBank1 = await prisma.bank.findFirst({
        where: { bankCode: 'VPB', accountNumber: '0969185403' },
    });
    if (!existingBank1) {
        const bank1 = await prisma.bank.create({
            data: {
                bankCode: 'VPB',
                bankName: 'VPBank',
                accountNumber: '0969185403',
                accountName: 'TRAN THI HUYEN TRANG',
                isActive: true,
            },
        });
        console.log('Created bank:', bank1.bankName);
    }
    const existingBank2 = await prisma.bank.findFirst({
        where: { bankCode: 'VIB', accountNumber: '086998950' },
    });
    if (!existingBank2) {
        const bank2 = await prisma.bank.create({
            data: {
                bankCode: 'VIB',
                bankName: 'VIB',
                accountNumber: '086998950',
                accountName: 'NGUYEN KIEU THANH DIEM',
                isActive: true,
            },
        });
        console.log('Created bank:', bank2.bankName);
    }
    console.log('Seed completed!');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map