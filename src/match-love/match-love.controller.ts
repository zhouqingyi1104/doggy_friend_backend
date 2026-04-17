import { Controller, Get, Post, Delete, Body, Req, Param, Query, UseGuards } from '@nestjs/common';
import { MatchLoveService } from './match-love.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { CreateMatchLoveDto } from './dto/create-match-love.dto';

@Controller('api/wechat')
@UseGuards(JwtAuthGuard)
export class MatchLoveController {
  constructor(private readonly matchLoveService: MatchLoveService) {}

  @Post('match_love')
  async save(
    @Req() req,
    @Body() body: CreateMatchLoveDto
  ) {
    const user = req.user;
    const attachmentsStr = Array.isArray(body.attachments) 
      ? body.attachments.join(',') 
      : (body.attachments || '');

    return this.matchLoveService.createMatchLove(
      user.id,
      user.college_id || BigInt(0),
      body.user_name,
      body.match_name,
      body.content || '',
      attachmentsStr,
      body.private || 1
    );
  }

  @Get('match_loves')
  async matchLoves(@Req() req, @Query() query: any) {
    const user = req.user;
    const pageSize = parseInt(query.page_size, 10) || 10;
    const pageNumber = parseInt(query.page_number, 10) || 1;
    const type = parseInt(query.type, 10) || 1;
    const just = query.just === 'true' || query.just === '1';
    const orderBy = query.order_by || 'created_at';
    const sortBy = query.sort_by || 'desc';
    const userId = query.user_id && query.user_id !== 'undefined' ? BigInt(query.user_id) : undefined;

    return this.matchLoveService.getMatchLovesList(
      user.app_id,
      user.id,
      pageSize,
      pageNumber,
      type,
      just,
      orderBy,
      sortBy,
      userId,
      user.college_id || undefined,
    );
  }

  @Get('most_new_match_loves')
  async newList() {
    return { error_code: 0, data: [] };
  }

  @Get('match_love/:id')
  async detail(@Param('id') id: string) {
    return { error_code: 0, data: null };
  }

  @Get('match/:id/result')
  async matchSuccess(@Param('id') id: string) {
    return { error_code: 0, data: null };
  }

  @Delete('delete/:id/match_love')
  async destroy(@Param('id') id: string) {
    return { error_code: 0, data: 1 };
  }
}
