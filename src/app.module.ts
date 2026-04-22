import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { WeChatModule } from './wechat/wechat.module';
import { UserModule } from './user/user.module';
import { PostModule } from './post/post.module';
import { InteractionModule } from './interaction/interaction.module';
import { QiniuModule } from './qiniu/qiniu.module';
import { ChatModule } from './chat/chat.module';
import { SaleFriendModule } from './sale-friend/sale-friend.module';
import { MatchLoveModule } from './match-love/match-love.module';
import { CompareFaceModule } from './compare-face/compare-face.module';
import { TravelModule } from './travel/travel.module';
import { JobModule } from './job/job.module';
import { UtilsModule } from './utils/utils.module';
import { TaskModule } from './task/task.module';
import { WalletModule } from './wallet/wallet.module';
import { GoodsModule } from './goods/goods.module';
import { ReviewModule } from './review/review.module';

@Module({
  imports: [
    PrismaModule,
    WeChatModule,
    AuthModule,
    UserModule,
    PostModule,
    InteractionModule,
    QiniuModule,
    ChatModule,
    SaleFriendModule,
    MatchLoveModule,
    CompareFaceModule,
    TravelModule,
    JobModule,
    UtilsModule,
    TaskModule,
    WalletModule,
    GoodsModule,
    ReviewModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}