import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { OfferModule } from '../offer/offer.module';
import { BlogModule } from '../blog/blog.module';
import { ReviewModule } from '../review/review.module';
import { FaqModule } from '../faq/faq.module';
import { MetaModule } from '../meta/meta.module';

@Module({
  imports: [OfferModule, BlogModule, ReviewModule, FaqModule, MetaModule],
  controllers: [AdminController],
})
export class AdminModule {}
