import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const cookieSession = require('cookie-session')


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.use(cookieSession({
    keys: ['asasskdsaf']
}))

  await app.listen(3000);
}
bootstrap();
