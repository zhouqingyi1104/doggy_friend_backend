import { Controller, Get, Post, Delete, Body, Req, Param, Query, UseGuards } from '@nestjs/common';
import { SaleFriendService } from './sale-friend.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { CreateSaleFriendDto } from './dto/create-sale-friend.dto';

@Controller('api/wechat')
@UseGuards(JwtAuthGuard)
export class SaleFriendController {
  constructor(private readonly saleFriendService: SaleFriendService) {}

  @Post('sale_friend')
  async save(
    @Req() req,
    @Body() body: CreateSaleFriendDto
  ) {
    const user = req.user;
    const attachmentsStr = Array.isArray(body.attachments) 
      ? body.attachments.join(',') 
      : (body.attachments || '');

    return this.saleFriendService.createSaleFriend(
      user.id,
      user.college_id || BigInt(0),
      body.name,
      body.gender || 1,
      body.major || '',
      body.expectation || '',
      body.introduce,
      attachmentsStr,
    );
  }

  @Get('sale_friends')
  async saleFriends(@Req() req, @Query() query: any) {
    const user = req.user;
    const pageSize = parseInt(query.page_size, 10) || 10;
    const pageNumber = parseInt(query.page_number, 10) || 1;
    const type = parseInt(query.type, 10) || 1;
    const just = query.just === 'true' || query.just === '1';
    const orderBy = query.order_by || 'created_at';
    const sortBy = query.sort_by || 'desc';
    const userId = query.user_id && query.user_id !== 'undefined' ? BigInt(query.user_id) : undefined;

    return this.saleFriendService.getSaleFriendsList(
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

  @Get('sale_friends_v2')
  async saleFriendsV2(@Req() req, @Query() query: any) {
    // V2 uses the same listing logic, returning page_data format
    return this.saleFriends(req, query);
  }

  @Get('sale_friend/:id')
  async detail(@Req() req, @Param('id') id: string) {
    return this.saleFriendService.getSaleFriendDetail(BigInt(id), req.user.id);
  }

  @Get('most_new_sale_friend')
  async mostNewSaleFriends(@Req() req) {
    const user = req.user;
    return this.saleFriendService.getMostNewSaleFriends(user.app_id, user.id);
  }

  @Delete('delete/:id/sale_friend')
  async destroy(@Req() req, @Param('id') id: string) {
    return this.saleFriendService.deleteSaleFriend(BigInt(id), req.user.id);
  }
}
