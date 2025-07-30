import { IsInt, IsString, Max, MaxLength, Min } from 'class-validator';
import {Type} from "class-transformer";

export class CreateReviewDto {
    @IsString()
    @MaxLength(30)
    name: string;

    @IsString()
    text: string;

    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(5)
    stars: number;
}