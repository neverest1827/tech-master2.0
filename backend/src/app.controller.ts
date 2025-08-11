import {Controller, Get, NotFoundException, Param, Render, Req} from '@nestjs/common';
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
        const meta: Meta = await this.metaService.getMetaById('index');

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
        const meta: Meta = await this.metaService.getMetaById('reviews');

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
    async findAll(): Promise<{ posts: BlogPost[] }> {
        const posts: BlogPost[] = await this.blogService.findAll();
        return {posts};
    }

    @Get('/uslugi')
    @Render('services')
    async getServicesPage() {
        const blogPosts: BlogPost[] = await this.blogService.findMany([1,2]);
        const meta: Meta = await this.metaService.getMetaById('services');

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
    async getServiceEntry(@Param('slugPath') slugPath: string) {
        const slugParts = slugPath.split('/').filter(Boolean);

        const blogPosts: BlogPost[] = await this.blogService.findMany([1,2]);
        const reviews: Review[] = await this.reviewService.findMany(18);
        const offerEntry: Offer | null = await this.offerService.findBySlugPath(slugParts.at(-1));

        console.log(offerEntry);

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
