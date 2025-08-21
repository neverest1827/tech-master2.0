import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from "@nestjs/config";
import { BlogModule } from './blog/blog.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppDataSource } from './data-source';
import {APP_FILTER, APP_INTERCEPTOR} from "@nestjs/core";
import {AllExceptionsFilter} from "./filters/all-filter";
import { LoggerModule } from './logger/logger.module';
import {ResponseInterceptor} from "./interceptors/response-interceptor";
import { ReviewModule } from './review/review.module';
import { FaqModule } from './faq/faq.module';
import { OfferModule } from './offer/offer.module';
import { MetaModule } from './meta/meta.module';
import { PromoModule } from './promo/promo.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot(AppDataSource.options),
    BlogModule,
    LoggerModule,
    ReviewModule,
    FaqModule,
    OfferModule,
    MetaModule,
    PromoModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    AppService,
  ],
})
export class AppModule {}
