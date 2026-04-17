import { Controller, Get, Post, Delete, Body, Req, Query, Param, UseGuards } from '@nestjs/common';
import { CommentService } from './comment.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { CreateCommentDto } from './dto/create-comment.dto';

@Controller('api/wechat')
@UseGuards(JwtAuthGuard)
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post('comment')
  async store(
    @Req() req,
    @Body() body: CreateCommentDto,
  ) {
    const user = req.user;
    
    // Normalize attachments to string (comma separated)
    const attachmentsStr = Array.isArray(body.attachments) 
      ? body.attachments.join(',') 
      : (body.attachments || '');

    return this.commentService.createComment(
      user.id,
      BigInt(body.obj_id),
      body.content,
      body.type || 1,
      body.ref_comment_id ? BigInt(body.ref_comment_id) : undefined,
      attachmentsStr,
      user.college_id,
    );
  }

  @Get('comment')
  async list(@Query() query: any) {
    const objId = query.obj_id && query.obj_id !== 'undefined' ? BigInt(query.obj_id) : BigInt(0);
    const objType = parseInt(query.type, 10) || 1;
    const pageSize = parseInt(query.page_size, 10) || 10;
    const pageNumber = parseInt(query.page_number, 10) || 1;

    return this.commentService.getComments(objId, objType, pageSize, pageNumber);
  }

  @Delete('delete/:id/comment')
  async deleteComment(@Param('id') id: string) {
    return { error_code: 0, data: 1 };
  }
}
