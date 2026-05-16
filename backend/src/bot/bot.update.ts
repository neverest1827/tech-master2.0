import { Command, Ctx, Hears, Start, Update } from 'nestjs-telegraf';
import { Context } from 'telegraf';
import { BotService } from './bot.service';

@Update()
export class BotUpdate {
  constructor(private readonly botService: BotService) {}

  @Start()
  async onStart(@Ctx() ctx: Context) {
    await this.botService.greet(ctx);
  }

  @Command('id')
  async onId(@Ctx() ctx: Context) {
    const threadId = (ctx.message as any)?.message_thread_id;
    await ctx.reply(`Chat ID: <code>${ctx.chat?.id}</code>`, {
      parse_mode: 'HTML',
      message_thread_id: threadId,
    });
  }

  @Hears(/^привет$/i)
  async hearsHello(@Ctx() ctx: Context) {
    await ctx.reply('Привет! Чем могу помочь?');
  }
}
