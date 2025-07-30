import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Render,
  ParseIntPipe,
  Query,
  DefaultValuePipe,
  UseInterceptors
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import {BlogPost} from "../blog/entities/blog-post.entity";
import {BlogService} from "../blog/blog.service";
import {AnyFilesInterceptor} from "@nestjs/platform-express";

@Controller('otzyvy')
export class ReviewController {
  constructor(
      private readonly reviewService: ReviewService,
      private readonly blogService: BlogService,
  ) {}

  @Post('/otpravit-otzyv')
  @UseInterceptors(AnyFilesInterceptor())
  create(@Body() createReviewDto: CreateReviewDto) {
    return this.reviewService.create(createReviewDto);
  }

  @Get()
  @Render('reviews')
  async getReviewsPage() {
    const blogPosts: BlogPost[] = await this.blogService.findMany([1,2]);

    return {
      env: process.env.NODE_ENV,
      scriptName: 'reviews',
      styleName: 'reviews',
      title: 'Отзывы',
      blogPosts,
    }
  }

  @Get('paginate')
  async getPaginated(
      @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
      @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.reviewService.paginate(page, limit);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.reviewService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateReviewDto: UpdateReviewDto) {
    return this.reviewService.update(id, updateReviewDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.reviewService.remove(id);
  }
}
