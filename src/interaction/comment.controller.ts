import { Controller, Get, Post, Body, Req, Query, Param, UseGuards } from '@nestjs/common';
import { CommentService } from './comment.service';
import { JwtAuthGuard } from '../auth/jwt.guard';

@Controller('api/wechat')
@UseGuards(JwtAuthGuard)
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post('comment')
  async store(
    @Req() req,
    @Body() body: {
      obj_id: string;
      content: string;
      type: number; // 1 for Post, 2 for SaleFriend etc.
      ref_comment_id?: string;
      attachments?: string;
    },
  ) {
    const user = req.user;
    
    return this.commentService.createComment(
      user.id,
      BigInt(body.obj_id),
      body.content,
      body.type || 1,
      body.ref_comment_id ? BigInt(body.ref_comment_id) : undefined,
      body.attachments,
      user.college_id,
    );
  }

  @Get('comment')
  async list(@Query() query: any) {
    const objId = BigInt(query.obj_id);
    const objType = parseInt(query.type, 10) || 1;
    const pageSize = parseInt(query.page_size, 10) || 10;
    const pageNumber = parseInt(query.page_number, 10) || 1;

    return this.commentService.getComments(objId, objType, pageSize, pageNumber);
  }
}