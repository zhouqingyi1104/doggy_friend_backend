import { WalletService } from './wallet.service';
export declare class WalletController {
    private readonly walletService;
    constructor(walletService: WalletService);
    getWallet(req: any): Promise<{
        user_id: string;
        balance: number;
        frozen_balance: number;
    }>;
    recharge(req: any, amount: number): Promise<{
        user_id: string;
        balance: number;
        message: string;
    }>;
    withdraw(req: any, amount: number): Promise<{
        user_id: string;
        balance: number;
        message: string;
    }>;
}
