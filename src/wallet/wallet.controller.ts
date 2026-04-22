import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { JwtAuthGuard } from '../auth/jwt.guard';

@UseGuards(JwtAuthGuard)
@Controller('api/wechat/wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Get('info')
  getWallet(@Request() req) {
    return this.walletService.getWallet(req.user.id);
  }

  @Post('recharge')
  recharge(@Request() req, @Body('amount') amount: number) {
    return this.walletService.recharge(req.user.id, amount);
  }

  @Post('withdraw')
  withdraw(@Request() req, @Body('amount') amount: number) {
    return this.walletService.withdraw(req.user.id, amount);
  }
}
