import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

// Fix BigInt serialization issue in JSON
(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS
  app.enableCors();
  
  await app.listen(process.env.PORT ?? 80);
}
bootstrap();
