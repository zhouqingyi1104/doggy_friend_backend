import { Controller, Get, Post, Body, Param, UseGuards, Request, Query } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';

@UseGuards(JwtAuthGuard)
@Controller('api/wechat/task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post('create')
  create(@Request() req, @Body() createTaskDto: CreateTaskDto) {
    return this.taskService.create(req.user.app_id, req.user.id, createTaskDto);
  }

  @Get('list')
  findAll(@Query() query: any) {
    return this.taskService.findAll(query);
  }

  @Get('my_published')
  myPublished(@Request() req, @Query() query: any) {
    const pageSize = parseInt(query.page_size, 10) || 10;
    const pageNumber = parseInt(query.page_number, 10) || 1;
    return this.taskService.findMyPublished(req.user.id, pageSize, pageNumber);
  }

  @Get('my_accepted')
  myAccepted(@Request() req, @Query() query: any) {
    const pageSize = parseInt(query.page_size, 10) || 10;
    const pageNumber = parseInt(query.page_number, 10) || 1;
    return this.taskService.findMyAccepted(req.user.id, pageSize, pageNumber);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.taskService.findOne(id);
  }

  @Post(':id/accept')
  accept(@Request() req, @Param('id') id: string) {
    return this.taskService.accept(req.user.id, id);
  }

  @Post(':id/complete')
  complete(@Request() req, @Param('id') id: string) {
    return this.taskService.complete(req.user.id, id);
  }

  @Post(':id/cancel')
  cancel(@Request() req, @Param('id') id: string, @Body('reason') reason: string) {
    return this.taskService.cancel(req.user.id, id, reason || '');
  }
}
