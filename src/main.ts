import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { AppModule } from './app.module';

console.log("this is going to be printed in the terminal");

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const corsOptions = {
    origin: '*',
    methods: 'GET, HEAD, PUT, PATCH, POST, DELETE',
    preflightContinue: false,
    optionSuccessStatus: 204,
    credentials: true,
    allowedHeaders: 'Content-Type, Accept, Authorize'
  };
  app.enableCors(corsOptions);
  const config = new DocumentBuilder()
    .setTitle('API example')
    .setDescription('Example description')
    .setVersion('1.0')
    .addTag('example')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  await app.listen(3000);
}
bootstrap();
