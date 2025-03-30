import {Controller, Get, Render} from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index')
  getIndexPage() {
    return {
      title: 'Главная страница',
      env: process.env.NODE_ENV
    };
  }
}
