import {Controller, Get, Res} from '@nestjs/common';
import { AppService } from './app.service';
import {Response} from "express";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getIndexPage(@Res() res: Response): void {
    const reviews = [
      {
        name: "Иван Иванов",
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum " +
            "tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat.",
        stars: 5,
        date: "18.07.2024"
      },
      {
        name: "Анна Петрова",
        text: "Очень довольна работой мастера.",
        stars: 4,
        date: "19.07.2024"
      },
      {
        name: "Сергей Сидоров",
        text: "Быстро приехали, все починили.",
        stars: 5,
        date: "20.07.2024"
      },
      {
        name: "Мария Смирнова",
        text: "Качественно, но могли бы приехать быстрее.",
        stars: 3,
        date: "21.07.2024"
      },
      {
        name: "Павел Воробьев",
        text: "Рекомендую всем, отличный сервис!",
        stars: 5,
        date: "22.07.2024"
      },
      {
        name: "Елена Кузнецова",
        text: "Все починили, но пришлось ждать.",
        stars: 4,
        date: "23.07.2024"
      },
      {
        name: "Алексей Морозов",
        text: "Немного дороговато, но качественно.",
        stars: 4,
        date: "24.07.2024"
      },
      {
        name: "Ольга Федорова",
        text: "Очень понравился сервис, буду обращаться еще.",
        stars: 5,
        date: "25.07.2024"
      },
      {
        name: "Дмитрий Васильев",
        text: "Быстро и качественно, спасибо!",
        stars: 5,
        date: "26.07.2024"
      },
      {
        name: "Анастасия Иванова",
        text: "Мастер опоздал, но работу выполнил хорошо.",
        stars: 3,
        date: "27.07.2024"
      },
      {
        name: "Виктор Ковалев",
        text: "Все отлично, спасибо!",
        stars: 5,
        date: "28.07.2024"
      },
      {
        name: "Ирина Новикова",
        text: "Хороший сервис, но могли бы быть быстрее.",
        stars: 4,
        date: "29.07.2024"
      },
      {
        name: "Андрей Захаров",
        text: "Все починили, я доволен.",
        stars: 5,
        date: "30.07.2024"
      },
      {
        name: "Светлана Баранова",
        text: "Хороший мастер, спасибо!",
        stars: 4,
        date: "31.07.2024"
      },
      {
        name: "Николай Сафонов",
        text: "Быстро и качественно, рекомендую.",
        stars: 5,
        date: "01.08.2024"
      },
      {
        name: "Людмила Орлова",
        text: "Довольна сервисом, буду обращаться еще.",
        stars: 5,
        date: "02.08.2024"
      },
      {
        name: "Владимир Голубев",
        text: "Все починили, но цена высокая.",
        stars: 3,
        date: "03.08.2024"
      },
      {
        name: "Марина Попова",
        text: "Отличный сервис, спасибо!",
        stars: 5,
        date: "04.08.2024"
      }
    ];
    return res.render('index.ejs', {reviews});
  }
}
