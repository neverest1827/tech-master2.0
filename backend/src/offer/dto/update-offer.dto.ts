import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateOfferDto {
  @IsString()
  @IsNotEmpty()
  content: string;
}
