import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { TransformInterceptor } from './common/transform.interceptor';
import { winstonLogger } from './common/logger';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

// Fix BigInt serialization issue in JSON
(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

async function bootstrap() {
  // Use NestExpressApplication to configure proxy
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: winstonLogger,
  });
  
  // ⚠️ API Tester Review Fix: Trust Proxy
  // Since CloudBase / CloudRun uses a load balancer, we must trust the proxy 
  // so rate limiting uses the actual client IP, not the load balancer IP.
  app.set('trust proxy', 1);

  // Security Middlewares
  app.use(helmet());
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 1000, // Increased limit from 100 to 1000 requests per windowMs
      message: 'Too many requests from this IP, please try again later.',
    }),
  );

  // Enable CORS
  app.enableCors();
  
  // Enable global validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  // Enable global response transform interceptor
  app.useGlobalInterceptors(new TransformInterceptor());

  // Swagger API Documentation Setup
  const config = new DocumentBuilder()
    .setTitle('Doggy Friend Backend API')
    .setDescription('The API documentation for WeChat Mini Program')
    .setVersion('1.0')
    .addBearerAuth() // Enable JWT Auth in Swagger UI
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);
  
  await app.listen(process.env.PORT ?? 80);
}
bootstrap();
