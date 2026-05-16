import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Render,
  Query,
  DefaultValuePipe,
} from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreateBlogPostDto } from './dto/create-blog-post.dto';
import { UpdateBlogPostDto } from './dto/update-blog-post.dto';
import { BlogPost } from './entities/blog-post.entity';

@Controller('api/blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post()
  create(@Body() createBlogPostDto: CreateBlogPostDto): Promise<BlogPost> {
    return this.blogService.create(createBlogPostDto);
  }

  @Get('paginate')
  async getPaginated(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return await this.blogService.paginate(page, limit);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBlogPostDto: UpdateBlogPostDto,
  ): Promise<BlogPost> {
    return this.blogService.update(id, updateBlogPostDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.blogService.remove(id);
  }
}
