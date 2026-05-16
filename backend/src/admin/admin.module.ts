import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { OfferModule } from '../offer/offer.module';
import { BlogModule } from '../blog/blog.module';
import { ReviewModule } from '../review/review.module';

@Module({
  imports: [OfferModule, BlogModule, ReviewModule],
  controllers: [AdminController],
})
export class AdminModule {}
