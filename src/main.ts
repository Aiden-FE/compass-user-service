import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { initYAMLConfig, getYAMLConfig, VALIDATION_OPTION } from '@app/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { PrismaService } from '@app/prisma';
import { AppModule } from './app.module';

declare const module: any;

async function bootstrap() {
  const config = getYAMLConfig();
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      logger: true,
    }),
  );
  app.connectMicroservice<MicroserviceOptions>(
    {
      transport: Transport.TCP,
      options: {
        port: 3002,
      },
    },
    {
      inheritAppConfig: true,
    },
  );
  // 统一接口前缀
  app.setGlobalPrefix('api');
  // 接口多版本
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });
  app.useGlobalPipes(
    // 入参数据验证
    new ValidationPipe(VALIDATION_OPTION),
  );
  // cors 保护
  app.enableCors();

  // 注入文档
  const apiDocOptions = new DocumentBuilder()
    .setTitle('文档标题')
    .setDescription('文档描述')
    .setVersion('v1')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, apiDocOptions);
  SwaggerModule.setup('/api/docs', app, document);

  // 配置主数据库时进行连接
  if (config.env.DATABASE_URL) {
    const prismaService = app.get(PrismaService);
    await prismaService.enableShutdownHooks(app);
  }

  await app.startAllMicroservices();
  await app.listen(3001);
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}

initYAMLConfig();
bootstrap();
