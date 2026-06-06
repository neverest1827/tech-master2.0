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

    return this.botService.notifyChat(chatId, message, {
      parse_mode: 'HTML',
    });
  }

  buildRequestMessage(createRequestDto: CreateRequestDto) {
    const dateTime = new Date().toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const pageUrl = this.buildPageUrlLink(createRequestDto.pageUrl);

    return [
      '<b>Заявка с сайта!</b>',
      `Создана: ${this.escapeHtml(dateTime)}`,
      `Имя: ${this.escapeHtml(createRequestDto.name || '-')}`,
      `Телефон: ${this.escapeHtml(createRequestDto.tel)}`,
      `Описание: ${this.escapeHtml(createRequestDto.text || '-')}`,
      `Страница: ${pageUrl}`,
    ].join('\n');
  }

  private buildPageUrlLink(pageUrl?: string) {
    if (!pageUrl) {
      return '-';
    }

    try {
      const url = new URL(pageUrl);

      if (!['http:', 'https:'].includes(url.protocol)) {
        return this.escapeHtml(pageUrl);
      }

      const escapedUrl = this.escapeHtml(url.href);

      return `<a href="${escapedUrl}">${escapedUrl}</a>`;
    } catch {
      return this.escapeHtml(pageUrl);
    }
  }

  private escapeHtml(value: string) {
    return value
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;');
  }
}
