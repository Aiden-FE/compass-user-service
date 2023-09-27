import { NestFactory, Reflector } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { JWTAuthGuard, ResponseInterceptor, VALIDATION_OPTION } from '@app/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: 3001,
    },
  });

  const reflector = app.get(Reflector);
  app.useGlobalGuards(new JWTAuthGuard(reflector));
  app.useGlobalPipes(new ValidationPipe(VALIDATION_OPTION));
  app.useGlobalInterceptors(new ResponseInterceptor());

  app.listen().then(() => Logger.log('User service is listening on 0.0.0.0:3001/TCP port'));
}

bootstrap();
