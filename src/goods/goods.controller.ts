import { Controller, Get, Post, Body, Param, UseGuards, Request, Query } from '@nestjs/common';
import { GoodsService } from './goods.service';
import { CreateGoodsDto } from './dto/create-goods.dto';
import { BuyGoodsDto } from './dto/buy-goods.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';

@UseGuards(JwtAuthGuard)
@Controller('api/wechat/goods')
export class GoodsController {
  constructor(private readonly goodsService: GoodsService) {}

  @Post('publish')
  publish(@Request() req, @Body() createGoodsDto: CreateGoodsDto) {
    return this.goodsService.publish(req.user.app_id, req.user.id, createGoodsDto);
  }

  @Get('list')
  findAll(@Query() query: any) {
    return this.goodsService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.goodsService.findOne(id);
  }

  @Post(':id/buy')
  buy(@Request() req, @Param('id') id: string, @Body() buyGoodsDto: BuyGoodsDto) {
    return this.goodsService.buy(req.user.id, id, buyGoodsDto.quantity);
  }
}
