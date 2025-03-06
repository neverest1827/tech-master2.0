import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Делаем конфигурацию глобальной
      envFilePath: '.env', // Файл переменных окружения
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
