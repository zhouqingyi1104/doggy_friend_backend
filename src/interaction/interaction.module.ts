import { Module } from '@nestjs/common';
import { PraiseController } from './praise.controller';
import { PraiseService } from './praise.service';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { FollowController } from './follow.controller';
import { FollowService } from './follow.service';

@Module({
  controllers: [PraiseController, CommentController, FollowController],
  providers: [PraiseService, CommentService, FollowService],
  exports: [PraiseService, CommentService, FollowService],
})
export class InteractionModule {}