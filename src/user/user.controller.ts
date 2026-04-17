import { Controller, Get, Post, Put, Body, Req, UseGuards, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery, ApiParam } from '@nestjs/swagger';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/jwt.guard';

@ApiTags('用户资料 (User)')
@ApiBearerAuth()
@Controller('api/wechat')
@UseGuards(JwtAuthGuard) // Protect all user routes
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('check_login')
  @ApiOperation({ summary: '检测登录路由' })
  async checkLogin() {
    return { error_code: 0, data: '' };
  }

  @Get('personal_info')
  @ApiOperation({ summary: '获取个人/他人资料', description: '如果有 user_id 参数则获取他人的资料，否则获取自己当前的资料' })
  @ApiQuery({ name: 'user_id', required: false, description: '目标用户的 ID' })
  async personal(@Req() req, @Query('user_id') queryUserId: string) {
    const userId = queryUserId && queryUserId !== 'undefined' ? BigInt(queryUserId) : req.user.id;
    return this.userService.getUser(userId);
  }

  @Get('school')
  async school(@Req() req) {
    return this.userService.getSchool(req.user.id);
  }

  @Get('recommend_school')
  async recommendSchool() {
    return this.userService.getRecommendSchools();
  }

  @Put('set/:id/college')
  async setCollege(@Req() req, @Param('id') collegeId: string) {
    return this.userService.setCollege(req.user.id, BigInt(collegeId));
  }

  @Get('search_college')
  async searchCollege(@Query('college') name: string) {
    return this.userService.searchCollege(name);
  }

  @Put('clear_school')
  async clearSchool(@Req() req) {
    return this.userService.clearSchool(req.user.id);
  }

  @Post('user/update/signature')
  async updateSignature(@Req() req, @Body() body: { nickname: string; avatar: string }) {
    // legacy used this for nickname/avatar/signature
    return this.userService.updateUser(req.user.id, body.nickname, body.avatar);
  }

  @Get('service')
  async service() {
    return { error_code: 0, data: 1 };
  }

  @Post('profile')
  async createProfile(
    @Req() req,
    @Body() body: {
      mobile: string;
      username: string;
      grade: string;
      major: string;
      student_number: string;
      college: string;
    },
  ) {
    return this.userService.createOrUpdateProfile(
      req.user.id,
      body.mobile,
      body.username,
      body.grade,
      body.major,
      body.student_number,
      body.college,
    );
  }

  @Get('user/:id')
  async user(@Param('id') id: string) {
    return this.userService.getUser(BigInt(id));
  }

  // Mock for sale_friends_v2 since it's not implemented yet
  @Get('sale_friends_v2')
  async saleFriendsV2() {
    return { error_code: 0, data: { page_data: [] } };
  }
}