import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Render,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { OfferService } from '../offer/offer.service';
import { BlogService } from '../blog/blog.service';
import { ReviewService } from '../review/review.service';
import { UpdateOfferDto } from '../offer/dto/update-offer.dto';
import { Offer } from '../offer/entities/offer.entity';
import { BlogPost } from '../blog/entities/blog-post.entity';
import { Review } from '../review/entities/review.entity';
import { FaqService } from '../faq/faq.service';
import { AdminBlogPostInput } from '../blog/blog.service';
import { MetaService } from '../meta/meta.service';
import { UpdateMetaDto } from '../meta/dto/update-meta.dto';

@Controller('admin')
export class AdminController {
  constructor(
    private readonly offerService: OfferService,
    private readonly blogService: BlogService,
    private readonly reviewService: ReviewService,
    private readonly faqService: FaqService,
    private readonly metaService: MetaService,
  ) {}

  @Get()
  @Render('admin')
  getAdminPage() {
    return {};
  }

  @Get('offers')
  @Render('admin-offers')
  async getOffersPage() {
    const offers = await this.offerService.findAll();

    return { offers };
  }

  @Get('offers/:id')
  @Render('admin-offer')
  async getOfferEditor(
    @Param('id', ParseIntPipe) id: number,
    @Query('saved') saved?: string,
  ) {
    const offer = await this.offerService.findOne(id);

    return {
      offer,
      saved: saved === '1',
    };
  }

  @Post('offers/:id')
  async updateOffer(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateOfferDto: UpdateOfferDto,
    @Res() res: Response,
  ) {
    await this.offerService.update(id, updateOfferDto);
    return res.redirect(`/admin/offers/${id}?saved=1`);
  }

  @Get('reviews')
  @Render('admin-reviews')
  async getReviewsPage(@Query('saved') saved?: string) {
    const reviews: Review[] = await this.reviewService.findAllForAdmin();

    return {
      reviews,
      saved: saved === '1',
    };
  }

  @Post('reviews/:id/approve')
  async approveReview(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ) {
    await this.reviewService.setApproved(id, true);
    return res.redirect('/admin/reviews?saved=1');
  }

  @Post('reviews/:id/unapprove')
  async unapproveReview(
    @Param('id', ParseIntPipe) id: number,
    @Res() res: Response,
  ) {
    await this.reviewService.setApproved(id, false);
    return res.redirect('/admin/reviews?saved=1');
  }

  @Post('reviews/:id/text')
  async updateReviewText(
    @Param('id', ParseIntPipe) id: number,
    @Body('text') text: string,
    @Res() res: Response,
  ) {
    await this.reviewService.updateText(id, text);
    return res.redirect('/admin/reviews?saved=1');
  }

  @Get('faqs')
  @Render('admin-faqs')
  async getFaqsPage(@Query('created') created?: string) {
    const faqs = await this.faqService.findAllForAdmin();

    return {
      faqs,
      created: created === '1',
    };
  }

  @Get('faqs/new')
  @Render('admin-faq')
  async getNewFaqPage() {
    const offers = await this.offerService.findAll();

    return {
      faq: null,
      offers,
      isNew: true,
      saved: false,
    };
  }

  @Post('faqs')
  async createFaq(
    @Body('question') question: string,
    @Body('answer') answer: string,
    @Body('scope') scope: string,
    @Body('offerIds') offerIds: string | string[] | undefined,
    @Res() res: Response,
  ) {
    const faq = await this.faqService.createForAdmin(
      question,
      answer,
      this.parseOfferIds(scope, offerIds),
    );
    return res.redirect(`/admin/faqs/${faq.id}?saved=1`);
  }

  @Get('faqs/:id')
  @Render('admin-faq')
  async getFaqEditor(
    @Param('id', ParseIntPipe) id: number,
    @Query('saved') saved?: string,
  ) {
    const [faq, offers] = await Promise.all([
      this.faqService.findOne(id),
      this.offerService.findAll(),
    ]);

    return {
      faq,
      offers,
      isNew: false,
      saved: saved === '1',
    };
  }

  @Post('faqs/:id')
  async updateFaq(
    @Param('id', ParseIntPipe) id: number,
    @Body('question') question: string,
    @Body('answer') answer: string,
    @Body('scope') scope: string,
    @Body('offerIds') offerIds: string | string[] | undefined,
    @Res() res: Response,
  ) {
    await this.faqService.updateForAdmin(
      id,
      question,
      answer,
      this.parseOfferIds(scope, offerIds),
    );
    return res.redirect(`/admin/faqs/${id}?saved=1`);
  }

  @Get('blog')
  @Render('admin-blog')
  async getBlogPage(@Query('created') created?: string) {
    const posts = await this.blogService.findAll();

    return {
      posts,
      created: created === '1',
    };
  }

  @Get('blog/new')
  @Render('admin-blog-post')
  getNewBlogPostPage() {
    return {
      post: null,
      isNew: true,
      saved: false,
    };
  }

  @Post('blog')
  async createBlogPost(
    @Body() input: AdminBlogPostInput,
    @Res() res: Response,
  ) {
    const post = await this.blogService.createForAdmin(input);
    return res.redirect(`/admin/blog/${post.id}?saved=1`);
  }

  @Get('blog/:id')
  @Render('admin-blog-post')
  async getBlogPostEditor(
    @Param('id', ParseIntPipe) id: number,
    @Query('saved') saved?: string,
  ) {
    const post = await this.blogService.findOne(id);

    return {
      post,
      isNew: false,
      saved: saved === '1',
    };
  }

  @Post('blog/:id')
  async updateBlogPost(
    @Param('id', ParseIntPipe) id: number,
    @Body() input: AdminBlogPostInput,
    @Res() res: Response,
  ) {
    await this.blogService.updateForAdmin(id, input);
    return res.redirect(`/admin/blog/${id}?saved=1`);
  }

  @Get('blog/:id/preview')
  @Render('article')
  async getBlogPostPreview(@Param('id', ParseIntPipe) id: number) {
    const post = await this.blogService.findOne(id);
    const blogPosts = await this.blogService.findMany([1, 2]);
    const reviews = await this.reviewService.findMany(18);

    return {
      env: process.env.NODE_ENV,
      scriptName: 'article',
      styleName: 'article',
      meta: post.meta,
      content: post.content,
      previewImageURL: post.previewImageURL,
      faqs: post.faqs || [],
      blogPosts,
      reviews,
    };
  }

  @Get('meta')
  @Render('admin-meta')
  async getMetaPage() {
    const items = await this.metaService.findAllForAdmin();

    return { items };
  }

  @Get('meta/:id')
  @Render('admin-meta-item')
  async getMetaEditor(
    @Param('id', ParseIntPipe) id: number,
    @Query('saved') saved?: string,
  ) {
    const meta = await this.metaService.findOne(id);

    return {
      meta,
      saved: saved === '1',
    };
  }

  @Post('meta/:id')
  async updateMeta(
    @Param('id', ParseIntPipe) id: number,
    @Body() input: UpdateMetaDto,
    @Res() res: Response,
  ) {
    await this.metaService.update(id, input);
    return res.redirect(`/admin/meta/${id}?saved=1`);
  }

  @Get('offers/:id/preview')
  @Render('offer')
  async getOfferPreview(@Param('id', ParseIntPipe) id: number) {
    const offer: Offer = await this.offerService.findOne(id);
    const blogPosts: BlogPost[] = await this.blogService.findMany([1, 2]);
    const reviews: Review[] = await this.reviewService.findMany(18);

    return {
      env: process.env.NODE_ENV,
      scriptName: 'offer',
      styleName: 'offer',
      meta: offer.meta,
      content: offer.content,
      faqs: offer.faqs,
      blogPosts,
      reviews,
      breadcrumbs: [],
    };
  }

  private parseOfferIds(
    scope: string,
    offerIds: string | string[] | undefined,
  ): number[] {
    if (scope !== 'offers') {
      return [];
    }

    const values = Array.isArray(offerIds) ? offerIds : [offerIds];

    const ids = values
      .filter((value): value is string => Boolean(value))
      .map((value) => Number(value))
      .filter((value) => Number.isInteger(value) && value > 0);

    if (!ids.length) {
      throw new BadRequestException(
        'Выберите хотя бы одну услугу или укажите общий FAQ',
      );
    }

    return ids;
  }
}
