import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Offer } from './entities/offer.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateOfferDto } from './dto/update-offer.dto';

@Injectable()
export class OfferService {
  constructor(
    @InjectRepository(Offer)
    private readonly offerRepository: Repository<Offer>,
  ) {}

  async findAll(): Promise<Offer[]> {
    return this.offerRepository.find({
      order: { createdAt: 'DESC' },
      relations: ['meta'],
    });
  }

  async findOne(id: number): Promise<Offer> {
    const offer = await this.offerRepository.findOne({
      where: { id },
      relations: ['meta', 'faqs'],
    });

    if (!offer) {
      throw new NotFoundException(`Услуга #${id} не найдена`);
    }

    return offer;
  }

  async findBySlugPath(slugPath: string | undefined): Promise<Offer> {
    if (!slugPath) {
      throw new NotFoundException('Путь не был передан');
    }

    const offer = await this.offerRepository.findOne({
      where: { slug: slugPath },
      relations: ['meta', 'faqs'],
    });

    if (!offer) {
      throw new NotFoundException('Услуга не найдена');
    }

    return offer;
  }

  async update(id: number, updateOfferDto: UpdateOfferDto): Promise<Offer> {
    const offer = await this.findOne(id);
    const updated = Object.assign(offer, updateOfferDto);

    return this.offerRepository.save(updated);
  }
}
