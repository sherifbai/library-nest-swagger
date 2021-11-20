import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  const options = new DocumentBuilder()
    .setTitle('Library API')
    .setDescription('Library API')
    .addBearerAuth(
      {
        name: 'Authorization',
        type: 'http',
        scheme: 'Bearer',
        bearerFormat: 'Bearer',
        in: 'Header',
      },
      'access-token',
    )
    .setVersion('1.0.0')
    .addServer('https://app.swaggerhub.com/apis/sherifbai/library/1.0.0#/')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
