import { Transform } from 'class-transformer';
import { IsString, Matches, IsOptional } from 'class-validator';

// Приводим к "цифры + плюс": убираем пробелы, дефисы и скобки.
const normalizePhone = (v: any) => String(v ?? '').replace(/[^\d+]/g, '');

const PHONE_REGEX = /^\+?375(?:17|25|29|33|44)\d{7}/;

export class CreateRequestDto {
  @IsOptional()
  @IsString()
  name?: string;

  @Transform(({ value }) => normalizePhone(value))
  @Matches(PHONE_REGEX, {
    message:
      'Телефон должен быть номером BY (+375...) без лишних символов',
  })
  tel: string;

  @IsOptional()
  @IsString()
  text?: string;
}
