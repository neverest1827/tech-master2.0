import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Review} from "./entities/review.entity";
import {BlogModule} from "../blog/blog.module";

@Module({
  imports: [
      TypeOrmModule.forFeature([Review]),
      BlogModule
  ],
  controllers: [ReviewController],
  providers: [ReviewService],
  exports: [ReviewService],
})
export class ReviewModule {}
