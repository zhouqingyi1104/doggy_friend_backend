import { Controller, Get, Post, Body, Req, Query, Param, UseGuards } from '@nestjs/common';
import { TravelService } from './travel.service';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Controller('api/wechat')
@UseGuards(JwtAuthGuard)
export class TravelController {
  constructor(private readonly travelService: TravelService) {}

  @Get('run_statistic')
  async runStatistic(@Req() req) {
    return this.travelService.getStatisticStep(req.user.id);
  }

  @Get('my_rank')
  async myRank(@Req() req) {
    return this.travelService.getMyRank(req.user.id);
  }

  @Post('step_travel')
  async saveStep(
    @Req() req,
    @Body() body: { encrypted_data: string; iv: string; code: string }
  ) {
    return this.travelService.saveStep(req.user.id, body.encrypted_data, body.iv, body.code);
  }

  @Get('step_travels')
  async steps(@Req() req, @Query() query: any) {
    const pageSize = parseInt(query.page_size, 10) || 10;
    const pageNumber = parseInt(query.page_number, 10) || 1;
    return this.travelService.getSteps(req.user.id, pageSize, pageNumber);
  }

  @Get('step_travel/:id')
  async detail(@Param('id') id: string) {
    return { error_code: 0, data: null };
  }
}
