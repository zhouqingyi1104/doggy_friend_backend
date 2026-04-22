import { PrismaService } from '../prisma/prisma.service';
export declare class WalletService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getWallet(userId: number): Promise<{
        user_id: string;
        balance: number;
        frozen_balance: number;
    }>;
    recharge(userId: number, amount: number): Promise<{
        user_id: string;
        balance: number;
        message: string;
    }>;
    withdraw(userId: number, amount: number): Promise<{
        user_id: string;
        balance: number;
        message: string;
    }>;
}
