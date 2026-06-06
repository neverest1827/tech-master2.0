import { Transform } from 'class-transformer';
import { IsOptional, IsString, Matches } from 'class-validator';

const normalizePhone = (value: unknown) => {
  const phone = String(value ?? '').replace(/[^\d+]/g, '');

  return phone.startsWith('375') ? `+${phone}` : phone;
};

const PHONE_REGEX = /^\+375(?:17|25|29|33|44)\d{7}$/;

export class CreateRequestDto {
  @IsOptional()
  @IsString()
  name?: string;

  @Transform(({ value }) => normalizePhone(value))
  @Matches(PHONE_REGEX, {
    message:
      'Телефон должен быть номером Беларуси в формате +375 (17/25/29/33/44) XXX-XX-XX',
  })
  tel: string;

  @IsOptional()
  @IsString()
  text?: string;

  @IsOptional()
  @IsString()
  pageUrl?: string;
}
