import { Injectable } from '@nestjs/common';
import { InjectBot } from 'nestjs-telegraf';
import { Context, Telegraf } from 'telegraf';
import { ExtraReplyMessage } from 'telegraf/typings/telegram-types';

@Injectable()
export class BotService {
  constructor(@InjectBot() private readonly bot: Telegraf<Context>) {}

  async greet(ctx: Context) {
    await ctx.reply(
      'Добро пожаловать! Это бот техподдержки. Напишите, что случилось.',
    );
  }

  async routeMessage(ctx: Context) {
    const text = (ctx.message as any)?.text ?? '';
    if (/help|помощ/i.test(text)) {
      return ctx.reply('Доступные команды: /start, /help, /order');
    }
  }

  /** Отправляет сообщение в любой чат по chatId из других модулей. */
  async notifyChat(
    chatId: number | string,
    text: string,
    extra?: ExtraReplyMessage,
  ) {
    return this.bot.telegram.sendMessage(chatId, text, extra);
  }
}
