import {
  Controller,
  Get,
  Param,
  Render,
} from '@nestjs/common';
import { AppService } from './app.service';
import { BlogService } from './blog/blog.service';
import { BlogPost } from './blog/entities/blog-post.entity';
import { ReviewService } from './review/review.service';
import { Review } from './review/entities/review.entity';
import { FaqService } from './faq/faq.service';
import { Faq } from './faq/entities/faq.entity';
import { OfferService } from './offer/offer.service';
import { Offer } from './offer/entities/offer.entity';
import { MetaService } from './meta/meta.service';
import { Meta } from './meta/entities/meta.entity';
import { Promo } from './promo/entities/promo.entity';
import { PromoService } from './promo/promo.service';
import { BreadcrumbService } from './breadcrumb/breadcrumb.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly blogService: BlogService,
    private readonly reviewService: ReviewService,
    private readonly faqService: FaqService,
    private readonly offerService: OfferService,
    private readonly metaService: MetaService,
    private readonly promoService: PromoService,
    private readonly breadcrumbService: BreadcrumbService,
  ) {}

  @Get()
  @Render('index')
  async getIndexPage() {
    const blogPosts: BlogPost[] = await this.blogService.findMany([1, 2]);
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
      faqs,
    };
  }

  @Get('/otzyvy')
  @Render('reviews')
  async getReviewsPage() {
    const blogPosts: BlogPost[] = await this.blogService.findMany([1, 2]);
    const meta: Meta = await this.metaService.getMetaByName('reviews');

    return {
      env: process.env.NODE_ENV,
      scriptName: 'reviews',
      styleName: 'reviews',
      meta,
      blogPosts,
      breadcrumbs: [
        { label: 'Главная', href: '/' },
        { label: 'Отзывы', href: '/otzyvy' },
      ],
    };
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
      blogPosts,
      breadcrumbs: [
        { label: 'Главная', href: '/' },
        { label: 'Блог', href: '/blog' },
      ],
    };
  }

  @Get('/blog/*slugPath')
  @Render('article')
  async getArticlePage(@Param('slugPath') slugPath: string) {
    const slugParts = slugPath.split('/').filter(Boolean);

    const blogPosts: BlogPost[] = await this.blogService.findMany([1, 2]);
    const reviews: Review[] = await this.reviewService.findMany(18);
    const articleEntry: BlogPost = await this.blogService.findBySlug(
      slugParts.at(-1)!,
    );

    return {
      env: process.env.NODE_ENV,
      scriptName: 'article',
      styleName: 'article',
      meta: articleEntry.meta,
      content: articleEntry.content,
      previewImageURL: articleEntry.previewImageURL,
      faqs: articleEntry.faqs,
      blogPosts,
      reviews,
    };
  }

  @Get('/uslugi')
  @Render('services')
  async getServicesPage() {
    const blogPosts: BlogPost[] = await this.blogService.findMany([1, 2]);
    const meta: Meta = await this.metaService.getMetaByName('services');

    return {
      env: process.env.NODE_ENV,
      scriptName: 'services',
      styleName: 'services',
      meta,
      blogPosts,
    };
  }

  @Get('/uslugi/*slugPath')
  @Render('offer')
  async getOfferPage(@Param('slugPath') slugPath: string) {
    const slugParts = slugPath.split(',').filter(Boolean);

    const blogPosts: BlogPost[] = await this.blogService.findMany([1, 2]);
    const reviews: Review[] = await this.reviewService.findMany(18);
    const offerEntry: Offer = await this.offerService.findBySlugPath(
      slugParts.at(-1),
    );
    const breadcrumbs = await this.breadcrumbService.buildBreadcrumbs(
      slugPath.replaceAll(',', '/'),
    );

    return {
      env: process.env.NODE_ENV,
      scriptName: 'offer',
      styleName: 'offer',
      meta: offerEntry.meta,
      content: offerEntry.content,
      faqs: offerEntry.faqs,
      blogPosts,
      reviews,
      breadcrumbs,
    };
  }

  @Get('/kontakty')
  @Render('contacts')
  async getContactsPage() {
    const pageData = await this.getContactsPageData();

    return {
      ...pageData,
      breadcrumbs: [
        { label: 'Главная', href: '/' },
        { label: 'Контакты', href: '/kontakty' },
      ],
    };
  }

  @Get('/otpravit-zayavku')
  @Render('contacts')
  async getRequestPage() {
    const pageData = await this.getContactsPageData();

    return {
      ...pageData,
      meta: {
        ...pageData.meta,
        title: 'Отправить заявку на ремонт компьютерной техники',
        description:
          'Оставьте заявку на выезд мастера по ремонту компьютерной техники в Минске.',
        canonicalUrl: '/otpravit-zayavku',
        ogUrl: '/otpravit-zayavku',
      },
      breadcrumbs: [
        { label: 'Главная', href: '/' },
        { label: 'Отправить заявку', href: '/otpravit-zayavku' },
      ],
    };
  }

  private async getContactsPageData() {
    const blogPosts: BlogPost[] = await this.blogService.findMany([1, 2]);
    const meta: Meta = await this.metaService.getMetaByName('contacts');

    return {
      env: process.env.NODE_ENV,
      scriptName: 'contacts',
      styleName: 'contacts',
      meta,
      blogPosts,
    };
  }

  @Get('/aktsii')
  @Render('promos')
  async getPromosPage() {
    const blogPosts: BlogPost[] = await this.blogService.findMany([1, 2]);
    const meta: Meta = await this.metaService.getMetaByName('promos');
    const faqs: Faq[] = await this.faqService.findAll();
    const promos: Promo[] = await this.promoService.findAll();

    return {
      env: process.env.NODE_ENV,
      scriptName: 'promos',
      styleName: 'promos',
      meta,
      blogPosts,
      faqs,
      promos,
      breadcrumbs: [
        { label: 'Главная', href: '/' },
        { label: 'Акции', href: '/aktsii' },
      ],
    };
  }

  @Get('/politika-konfidentsialnosti')
  @Render('privacy')
  async getPrivacyPage() {
    const blogPosts: BlogPost[] = await this.blogService.findMany([1, 2]);

    return {
      env: process.env.NODE_ENV,
      scriptName: 'privacy',
      styleName: 'privacy',
      blogPosts,
      meta: {
        title: 'Политика конфиденциальности | ТехМастер',
        description:
          'Политика обработки и защиты персональных данных пользователей сайта ТехМастер.',
        keywords: 'политика конфиденциальности, персональные данные, ТехМастер',
        canonicalUrl: '/politika-konfidentsialnosti',
        robots: 'index, follow',
        ogImage: '',
        ogUrl: '/politika-konfidentsialnosti',
        ogType: 'website',
        twitterCard: 'summary',
        twitterImage: '',
      },
      breadcrumbs: [
        { label: 'Главная', href: '/' },
        {
          label: 'Политика конфиденциальности',
          href: '/politika-konfidentsialnosti',
        },
      ],
    };
  }

  @Get('/politika-ispolzovaniya-faylov-cookie')
  @Render('cookie-policy')
  async getCookiePolicyPage() {
    const blogPosts: BlogPost[] = await this.blogService.findMany([1, 2]);

    return {
      env: process.env.NODE_ENV,
      scriptName: 'privacy',
      styleName: 'privacy',
      blogPosts,
      meta: {
        title: 'Политика использования файлов cookie | ТехМастер',
        description:
          'Информация об использовании файлов cookie на сайте ТехМастер и управлении ими в браузере.',
        keywords: 'cookie, файлы cookie, политика cookie, ТехМастер',
        canonicalUrl: '/politika-ispolzovaniya-faylov-cookie',
        robots: 'index, follow',
        ogImage: '',
        ogUrl: '/politika-ispolzovaniya-faylov-cookie',
        ogType: 'website',
        twitterCard: 'summary',
        twitterImage: '',
      },
      breadcrumbs: [
        { label: 'Главная', href: '/' },
        {
          label: 'Политика использования файлов cookie',
          href: '/politika-ispolzovaniya-faylov-cookie',
        },
      ],
    };
  }
}
