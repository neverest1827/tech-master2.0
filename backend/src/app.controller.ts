import {Controller, Get, Param, Render} from '@nestjs/common';
import {AppService} from './app.service';
import {BlogService} from "./blog/blog.service";
import {BlogPost} from "./blog/entities/blog-post.entity";
import {ReviewService} from "./review/review.service";
import {Review} from "./review/entities/review.entity";
import {FaqService} from "./faq/faq.service";
import {Faq} from "./faq/entities/faq.entity";
import {OfferService} from "./offer/offer.service";
import {Offer} from "./offer/entities/offer.entity";
import {MetaService} from "./meta/meta.service";
import {Meta} from "./meta/entities/meta.entity";

@Controller()
export class AppController {
    constructor(
        private readonly appService: AppService,
        private readonly blogService: BlogService,
        private readonly reviewService: ReviewService,
        private readonly faqService: FaqService,
        private readonly offerService: OfferService,
        private readonly metaService: MetaService,
    ) {}

    @Get()
    @Render('index')
    async getIndexPage() {
        const blogPosts: BlogPost[] = await this.blogService.findMany([1,2]);
        const reviews: Review[] = await this.reviewService.findMany(18);
        const faqs: Faq[] = await this.faqService.findAll();
        const meta: Meta = await this.metaService.getMetaByName('index');

        return {
            env: process.env.NODE_ENV,
            scriptName: 'main',
            styleName: 'main',
            meta,
            reviews,
            blogPosts,
            faqs
        };
    }

    @Get('/otzyvy')
    @Render('reviews')
    async getReviewsPage() {
        const blogPosts: BlogPost[] = await this.blogService.findMany([1,2]);
        const meta: Meta = await this.metaService.getMetaByName('reviews');

        return {
            env: process.env.NODE_ENV,
            scriptName: 'reviews',
            styleName: 'reviews',
            meta,
            blogPosts,
        }
    }

    @Get('/blog')
    @Render('blog')
    async findAll() {
        const blogPosts: BlogPost[] = await this.blogService.findAll();
        const meta: Meta = await this.metaService.getMetaByName('blog');
        const limit = 10;

        return {
            env: process.env.NODE_ENV,
            scriptName: 'blog',
            styleName: 'blog',
            total: blogPosts.length,
            limit,
            meta,
            blogPosts
        };
    }

    @Get('/blog/*slugPath')
    @Render('article')
    async getArticlePage(@Param('slugPath') slugPath: string) {
        const slugParts = slugPath.split('/').filter(Boolean);

        const blogPosts: BlogPost[] = await this.blogService.findMany([1,2]);
        const reviews: Review[] = await this.reviewService.findMany(18);
        const articleEntry: BlogPost = await this.blogService.findBySlug(slugParts.at(-1)!);

        return {
            env: process.env.NODE_ENV,
            scriptName: 'article',
            styleName: 'article',
            meta: articleEntry.meta,
            content: articleEntry.content,
            faqs: articleEntry.faqs,
            blogPosts,
            reviews,
        };
    }

    @Get('/uslugi')
    @Render('services')
    async getServicesPage() {
        const blogPosts: BlogPost[] = await this.blogService.findMany([1,2]);
        const meta: Meta = await this.metaService.getMetaByName('services');

        return {
            env: process.env.NODE_ENV,
            scriptName: 'services',
            styleName: 'services',
            meta,
            blogPosts,
        }
    }

    @Get('/uslugi/*slugPath')
    @Render('offer')
    async getOfferPage(@Param('slugPath') slugPath: string) {
        const slugParts = slugPath.split('/').filter(Boolean);

        const blogPosts: BlogPost[] = await this.blogService.findMany([1,2]);
        const reviews: Review[] = await this.reviewService.findMany(18);
        const offerEntry: Offer | null = await this.offerService.findBySlugPath(slugParts.at(-1));

        return {
            env: process.env.NODE_ENV,
            scriptName: 'offer',
            styleName: 'offer',
            meta: offerEntry?.meta,
            content: offerEntry?.content || '',
            blogPosts,
            reviews,
        };
    }
}
