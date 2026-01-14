import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS configuration from environment variables
  const corsOrigins = process.env.CORS_ORIGINS?.split(',') || [
    'http://localhost:5173',
  ];
  const corsMethods =
    process.env.CORS_METHODS || 'GET,HEAD,PUT,PATCH,POST,DELETE';
  const corsCredentials = process.env.CORS_CREDENTIALS === 'true';

  app.enableCors({
    origin: corsOrigins,
    methods: corsMethods,
    credentials: corsCredentials,
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
