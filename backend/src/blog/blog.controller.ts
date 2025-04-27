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
} from '@nestjs/common';
import {BlogService} from './blog.service';
import {CreateBlogPostDto} from './dto/create-blog-post.dto';
import {UpdateBlogPostDto} from './dto/update-blog-post.dto';
import {BlogPost} from "./entities/blog-post.entity";

@Controller('blog')
export class BlogController {
    constructor(private readonly blogService: BlogService) {
    }

    @Post()
    create(@Body() createBlogPostDto: CreateBlogPostDto): Promise<BlogPost> {
        return this.blogService.create(createBlogPostDto);
    }

    @Get()
    @Render('blog')
    async findAll(): Promise<{ posts: BlogPost[] }> {
        const posts: BlogPost[] = await this.blogService.findAll();
        return {posts};
    }

    @Get(':slug')
    @Render('blog-post')
    async findBySlug(@Param('slug') slug: string): Promise<{ post: BlogPost }> {
        const post: BlogPost = await this.blogService.findBySlug(slug);
        return {post};
    }

    @Patch(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() updateBlogPostDto: UpdateBlogPostDto): Promise<BlogPost> {
        return this.blogService.update(id, updateBlogPostDto);
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
        return this.blogService.remove(id);
    }
}
