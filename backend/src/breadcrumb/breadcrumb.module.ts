import { Module } from '@nestjs/common';
import { BreadcrumbService } from './breadcrumb.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Breadcrumb } from './entities/breadcrumb.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Breadcrumb])],
  providers: [BreadcrumbService],
  exports: [BreadcrumbService],
})
export class BreadcrumbModule {}
