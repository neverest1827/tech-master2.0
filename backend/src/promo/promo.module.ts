import { Module } from '@nestjs/common';
import { PromoService } from './promo.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Promo } from './entities/promo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Promo])],
  providers: [PromoService],
  exports: [PromoService],
})
export class PromoModule {}
