import {Controller, Get, Render} from '@nestjs/common';
import {AppService} from './app.service';
import {BlogService} from "./blog/blog.service";
import {BlogPost} from "./blog/entities/blog-post.entity";
import {ReviewService} from "./review/review.service";
import {Review} from "./review/entities/review.entity";
import {FaqService} from "./faq/faq.service";
import {Faq} from "./faq/entities/faq.entity";

@Controller()
export class AppController {
    constructor(
        private readonly appService: AppService,
        private readonly blogService: BlogService,
        private readonly reviewService: ReviewService,
        private readonly faqService: FaqService,
    ) {}

    @Get()
    @Render('index')
    async getIndexPage() {
        const blogPosts: BlogPost[] = await this.blogService.findMany([1,2]);
        const reviews: Review[] = await this.reviewService.findMany(18);
        const faqs: Faq[] = await this.faqService.findAll();

        return {
            title: 'Главная страница',
            env: process.env.NODE_ENV,
            reviews: reviews,
            blogPosts: blogPosts,
            faqs: faqs,
            scriptName: 'main',
            styleName: 'main'
        };
    }

    @Get('/otzyvy')
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

    @Get('/blog')
    @Render('blog')
    async findAll(): Promise<{ posts: BlogPost[] }> {
        const posts: BlogPost[] = await this.blogService.findAll();
        return {posts};
    }

    @Get('/uslugi')
    @Render('services')
    async getServicesPage() {
        const blogPosts: BlogPost[] = await this.blogService.findMany([1,2]);

        return {
            env: process.env.NODE_ENV,
            scriptName: 'services',
            styleName: 'services',
            title: 'Услуги',
            blogPosts,
        }
    }
}
