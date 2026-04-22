import { Controller, Get, Post, Delete, Body, Req, Param, Query, UseGuards } from '@nestjs/common';
import { PostService } from './post.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { CreatePostDto } from './dto/create-post.dto';

@Controller('api/wechat')
@UseGuards(JwtAuthGuard)
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post('post')
  async store(
    @Req() req,
    @Body() body: CreatePostDto,
  ) {
    const user = req.user;
    
    // Normalize attachments to string (comma separated)
    const attachmentsStr = Array.isArray(body.attachments) 
      ? body.attachments.join(',') 
      : (body.attachments || '');

    // Create the post
    const result = await this.postService.createPost(
      user.id,
      user.college_id || BigInt(0),
      body.content || '',
      attachmentsStr,
      body.username || '',
      body.private || 0,
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
    const userId = query.user_id && query.user_id !== 'undefined' ? BigInt(query.user_id) : undefined;

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
    const userId = query.user_id && query.user_id !== 'undefined' ? BigInt(query.user_id) : undefined;

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

  @Get('most_new_post')
  async mostNewPost() {
    return { error_code: 0, data: { page_data: [] } };
  }

  @Get('topic')
  async topic(@Req() req) {
    return this.postService.getLatestTopic(req.user.app_id);
  }

  @Get('topic/:id')
  async topicDetail(@Param('id') id: string) {
    return this.postService.getTopicDetail(BigInt(id));
  }

  @Get('topic/:id/comments')
  async topicComments(@Param('id') id: string, @Query() query: any) {
    const pageSize = parseInt(query.page_size, 10) || 10;
    const pageNumber = parseInt(query.page_number, 10) || 1;
    return this.postService.getTopicComments(BigInt(id), pageSize, pageNumber);
  }

  @Get('topic/:id/new_comments')
  async topicNewComments(@Param('id') id: string, @Query('time') time: string) {
    return this.postService.getTopicNewComments(BigInt(id), time);
  }

  @Post('praise/:id/topic')
  async praiseTopic(@Param('id') id: string) {
    return this.postService.praiseTopic(BigInt(id));
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