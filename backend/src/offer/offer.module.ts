import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Offer } from './entities/offer.entity';
import { OfferService } from './offer.service';

@Module({
  imports: [TypeOrmModule.forFeature([Offer])],
  providers: [OfferService],
  exports: [OfferService],
})
export class OfferModule {}
