import { utilities as nestWinstonModuleUtilities, WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import 'winston-daily-rotate-file';

const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.ms(),
  nestWinstonModuleUtilities.format.nestLike('DoggyFriend', {
    colors: true,
    prettyPrint: true,
  }),
);

export const winstonLogger = WinstonModule.createLogger({
  transports: [
    new winston.transports.Console({
      format: logFormat,
    }),
    new winston.transports.DailyRotateFile({
      dirname: 'logs/error',
      filename: '%DATE%-error.log',
      datePattern: 'YYYY-MM-DD',
      level: 'error',
      maxFiles: '30d',
      format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
    }),
    new winston.transports.DailyRotateFile({
      dirname: 'logs/app',
      filename: '%DATE%-app.log',
      datePattern: 'YYYY-MM-DD',
      maxFiles: '30d',
      format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
    }),
  ],
});
