import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Breadcrumb } from './entities/breadcrumb.entity';
import { Repository } from 'typeorm';

type TBreadcrumbs = {
  label: string;
  href: string;
}[];

@Injectable()
export class BreadcrumbService {
  constructor(
    @InjectRepository(Breadcrumb)
    private readonly breadcrumbRepository: Repository<Breadcrumb>,
  ) {}

  async buildBreadcrumbs(slug: string): Promise<TBreadcrumbs> {
    const data: Breadcrumb = await this.getData(slug);
    const breadcrumbs: TBreadcrumbs = [
      { label: 'Главная', href: '/' },
      { label: 'Услуги', href: '/uslugi' },
    ];

    for (const item of data.items) {
      breadcrumbs.push({ label: item.label, href: item.href });
    }

    return breadcrumbs;
  }

  async getData(slug: string): Promise<Breadcrumb> {
    const data: Breadcrumb | null = await this.breadcrumbRepository.findOne({
      where: { slug },
    });

    if (!data) throw new NotFoundException(`Breadcrumb ${slug} not found`);

    return data;
  }
}
