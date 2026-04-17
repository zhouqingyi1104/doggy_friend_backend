import { Controller, Get, Post, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('api/wechat')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('search')
  async search(@Query('keyword') keyword: string) {
    return { error_code: 0, data: [] }; // Mock search
  }

  @Post('location')
  async location() {
    return { error_code: 0, data: 1 };
  }
}
