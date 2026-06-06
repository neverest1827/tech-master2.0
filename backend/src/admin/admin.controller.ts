import {
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

@Controller('admin')
export class AdminController {
  constructor(
    private readonly offerService: OfferService,
    private readonly blogService: BlogService,
    private readonly reviewService: ReviewService,
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
}
