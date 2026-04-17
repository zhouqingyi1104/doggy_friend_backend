import { Controller, Get, Post, Body, Req, Query, Param, UseGuards } from '@nestjs/common';
import { JobService } from './job.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { CreateJobDto } from './dto/create-job.dto';

@Controller('api/wechat')
@UseGuards(JwtAuthGuard)
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @Post('part_time_job')
  async store(
    @Req() req,
    @Body() body: CreateJobDto
  ) {
    const attachmentsStr = Array.isArray(body.attachments) 
      ? body.attachments.join(',') 
      : (body.attachments || '');

    return this.jobService.createJob(
      req.user.id,
      body.title,
      body.content,
      attachmentsStr,
      body.salary || 0,
      body.end_at || ''
    );
  }

  @Post('apply_job')
  async applyJob(
    @Req() req,
    @Body() body: { id: string }
  ) {
    return this.jobService.applyJob(req.user.id, BigInt(body.id));
  }

  @Get('part_time_jobs')
  async list(@Query() query: any) {
    const pageSize = parseInt(query.page_size, 10) || 10;
    const pageNumber = parseInt(query.page_number, 10) || 1;
    return this.jobService.getJobList(pageSize, pageNumber);
  }

  @Get('part_time_job/:id')
  async detail(@Param('id') id: string) {
    return this.jobService.getJobDetail(BigInt(id));
  }
}
