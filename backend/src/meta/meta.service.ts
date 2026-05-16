import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Meta } from './entities/meta.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MetaService {
  constructor(
    @InjectRepository(Meta)
    private readonly metaRepository: Repository<Meta>,
  ) {}

  async getMetaByName(pageName: string): Promise<Meta> {
    return this.metaRepository.findOneByOrFail({ pageName });
  }
}
