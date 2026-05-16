import { Injectable } from '@nestjs/common';
import { CreateRequestDto } from './dto/create-request.dto';
import { BotService } from '../bot/bot.service';
import * as process from 'node:process';

@Injectable()
export class RequestService {
  constructor(private readonly botService: BotService) {}

  create(createRequestDto: CreateRequestDto) {
    const chatId = process.env.NOTIFICATION_CHAT_ID as string;
    const message = this.buildRequestMessage(createRequestDto);

    return this.botService.notifyChat(chatId, message);
  }

  buildRequestMessage(createRequestDto: CreateRequestDto) {
    const dateTime = new Date().toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    return `
Заявка с сайта!
Создана: ${dateTime}
Имя: ${createRequestDto.name || '-'}
Телефон: ${createRequestDto.tel}
Описание: ${createRequestDto.text || '-'}
    `;
  }
}
