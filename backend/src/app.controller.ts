import {Controller, Get, Render} from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index') // Рендерим index.ejs
  root() {
    return {
      title: 'Главная страница',
      username: 'Гость',
      env: process.env.NODE_ENV // Передаем переменную окружения
    };
  }
}
