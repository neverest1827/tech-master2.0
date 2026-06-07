import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Meta } from './entities/meta.entity';
import { Repository } from 'typeorm';
import { UpdateMetaDto } from './dto/update-meta.dto';

@Injectable()
export class MetaService {
  constructor(
    @InjectRepository(Meta)
    private readonly metaRepository: Repository<Meta>,
  ) {}

  async getMetaByName(pageName: string): Promise<Meta> {
    return this.metaRepository.findOneByOrFail({ pageName });
  }

  findAllForAdmin(): Promise<Meta[]> {
    return this.metaRepository.find({
      relations: ['offer', 'blogPost'],
      order: { pageName: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Meta> {
    const meta = await this.metaRepository.findOne({
      where: { id },
      relations: ['offer', 'blogPost'],
    });

    if (!meta) {
      throw new NotFoundException(`Метаданные #${id} не найдены`);
    }

    return meta;
  }

  async update(id: number, input: UpdateMetaDto): Promise<Meta> {
    const meta = await this.findOne(id);
    const title = String(input.title || '').trim();

    if (!title) {
      throw new BadRequestException('Title не может быть пустым');
    }

    meta.title = title;
    meta.description = this.optionalText(input.description);
    meta.keywords = this.optionalText(input.keywords);
    meta.canonicalUrl = this.optionalText(input.canonicalUrl);
    meta.robots = this.optionalText(input.robots) || 'index, follow';
    meta.ogImage = this.optionalText(input.ogImage);
    meta.ogUrl = this.optionalText(input.ogUrl);
    meta.ogType = this.optionalText(input.ogType);
    meta.twitterCard = this.optionalText(input.twitterCard);
    meta.twitterImage = this.optionalText(input.twitterImage);

    return this.metaRepository.save(meta);
  }

  private optionalText(value?: string): string {
    return String(value || '').trim();
  }
}
