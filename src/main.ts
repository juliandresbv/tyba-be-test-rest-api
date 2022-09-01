import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1');

  const apiDocsConfig = new DocumentBuilder()
    .setTitle('Tyba BE Engineer Test -- REST API')
    .setDescription('The Tyba BE Engineer Test -- REST API documentation')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'token',
    )
    .build();
  const document = SwaggerModule.createDocument(app, apiDocsConfig);
  SwaggerModule.setup('api/v1/docs', app, document, {
    explorer: true,
    swaggerOptions: {
      showRequestDuration: true,
    },
  });

  await app.listen(3000);
}

bootstrap();
