import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { WeChatModule } from './wechat/wechat.module';
import { UserModule } from './user/user.module';
import { PostModule } from './post/post.module';
import { InteractionModule } from './interaction/interaction.module';
import { QiniuModule } from './qiniu/qiniu.module';

@Module({
  imports: [
    PrismaModule,
    WeChatModule,
    AuthModule,
    UserModule,
    PostModule,
    InteractionModule,
    QiniuModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}