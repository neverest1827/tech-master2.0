import { IsInt, IsString, Max, MaxLength, Min } from 'class-validator';

export class CreateReviewDto {
    @IsString()
    @MaxLength(30)
    name: string;

    @IsString()
    text: string;

    @IsInt()
    @Min(1)
    @Max(5)
    stars: number;
}