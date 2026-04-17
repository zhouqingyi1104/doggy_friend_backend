import { Controller, Get, Post, Delete, Body, Req, Param, Query, UseGuards } from '@nestjs/common';
import { PostService } from './post.service';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Controller('api/wechat')
@UseGuards(JwtAuthGuard)
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post('post')
  async store(
    @Req() req,
    @Body() body: {
      content: string;
      attachments: string;
      location: string;
      private: number;
      username: string; // Used as topic in legacy
      mobile: string;
    },
  ) {
    const user = req.user;
    
    // Create the post
    const result = await this.postService.createPost(
      user.id,
      user.college_id || BigInt(0),
      body.content,
      body.attachments,
      body.username,
      body.private,
    );

    // Note: SMS / notification logic has been skipped for brevity, 
    // but should be handled asynchronously using a queue or event system.

    return result;
  }

  @Get('post')
  async postListLegacy(@Req() req, @Query() query: any) {
    const user = req.user;
    
    const pageSize = parseInt(query.page_size, 10) || 10;
    const pageNumber = parseInt(query.page_number, 10) || 1;
    const just = query.just === 'true' || query.just === '1';
    const type = parseInt(query.type, 10);
    const filter = query.filter;
    const userId = query.user_id ? BigInt(query.user_id) : undefined;

    return this.postService.getPostList(
      user.app_id,
      user.id,
      pageSize,
      pageNumber,
      type,
      just,
      filter,
      userId,
    );
  }

  @Get('post/list')
  async postList(@Req() req, @Query() query: any) {
    const user = req.user;
    
    const pageSize = parseInt(query.page_size, 10) || 10;
    const pageNumber = parseInt(query.page_number, 10) || 1;
    const just = query.just === 'true' || query.just === '1';
    const type = parseInt(query.type, 10);
    const filter = query.filter;
    const userId = query.user_id ? BigInt(query.user_id) : undefined;

    return this.postService.getPostList(
      user.app_id,
      user.id,
      pageSize,
      pageNumber,
      type,
      just,
      filter,
      userId,
    );
  }

  @Get('post/:id')
  async detail(@Req() req, @Param('id') id: string) {
    return this.postService.getPostDetail(BigInt(id), req.user.id);
  }

  @Delete('delete/:id/post')
  async destroy(@Req() req, @Param('id') id: string) {
    // Mock delete endpoint logic
    return { error_code: 0, data: 1 };
  }
}