import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateFaqDto } from './dto/create-faq.dto';
import { UpdateFaqDto } from './dto/update-faq.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Faq } from './entities/faq.entity';
import { Offer } from '../offer/entities/offer.entity';

@Injectable()
export class FaqService {
  constructor(
    @InjectRepository(Faq)
    private readonly faqRepository: Repository<Faq>,
    @InjectRepository(Offer)
    private readonly offerRepository: Repository<Offer>,
  ) {}

  /**
   * Создает новый элемент FAQ.
   * @param createFaqDto Данные для создания нового FAQ.
   * @returns Возвращает созданный объект FAQ.
   * @throws {Error} В случае ошибки при сохранении.
   */
  create(createFaqDto: CreateFaqDto): Promise<Faq> {
    const newFaq = this.faqRepository.create(createFaqDto);
    return this.faqRepository.save(newFaq);
  }

  /**
   * Возвращает все записи FAQ.
   * @returns Возвращает список всех элементов FAQ.
   */
  findAll(): Promise<Faq[]> {
    return this.faqRepository
      .createQueryBuilder('faq')
      .leftJoin('faq.offer', 'offer')
      .leftJoin('faq.blogPost', 'blogPost')
      .where('offer.id IS NULL')
      .andWhere('blogPost.id IS NULL')
      .orderBy('faq.id', 'ASC')
      .getMany();
  }

  findAllForAdmin(): Promise<Faq[]> {
    return this.faqRepository.find({
      relations: ['offer', 'offer.meta'],
      order: { id: 'DESC' },
    });
  }

  /**
   * Ищет и возвращает запись FAQ по ее ID.
   * @param id Идентификатор записи FAQ.
   * @returns Возвращает объект FAQ.
   * @throws {NotFoundException} Если запись не найдена.
   */
  async findOne(id: number): Promise<Faq> {
    const faq: Faq | null = await this.faqRepository.findOne({
      where: { id },
      relations: ['offer', 'offer.meta'],
    });

    if (!faq) throw new NotFoundException(`Faq ${id} не найден`);

    return faq;
  }

  /**
   * Обновляет запись FAQ по ее ID.
   * @param id Идентификатор записи FAQ.
   * @param updateFaqDto Данные для обновления FAQ.
   * @returns Возвращает обновленный объект FAQ.
   * @throws {NotFoundException} Если запись не найдена.
   */
  async update(id: number, updateFaqDto: UpdateFaqDto): Promise<Faq> {
    const faq: Faq = await this.findOne(id);
    const updated: Faq = Object.assign(faq, updateFaqDto);
    return this.faqRepository.save(updated);
  }

  async createForAdmin(
    question: string,
    answer: string,
    offerIds: number[],
  ): Promise<Faq> {
    const faq = this.faqRepository.create({
      question: this.requireText(question, 'Вопрос'),
      answer: this.requireText(answer, 'Ответ'),
      offer: await this.resolveOffers(offerIds),
    });

    return this.faqRepository.save(faq);
  }

  async updateForAdmin(
    id: number,
    question: string,
    answer: string,
    offerIds: number[],
  ): Promise<Faq> {
    const faq = await this.findOne(id);

    faq.question = this.requireText(question, 'Вопрос');
    faq.answer = this.requireText(answer, 'Ответ');
    faq.offer = await this.resolveOffers(offerIds);

    return this.faqRepository.save(faq);
  }

  /**
   * Удаляет запись FAQ по ее ID.
   * @param id Идентификатор записи FAQ.
   * @returns Возвращает ничего (void).
   * @throws {NotFoundException} Если запись не найдена.
   */
  async remove(id: number): Promise<void> {
    const faq: Faq = await this.findOne(id);
    await this.faqRepository.remove(faq);
  }

  private requireText(value: string, field: string): string {
    const normalized = String(value || '').trim();

    if (!normalized) {
      throw new BadRequestException(`${field} не может быть пустым`);
    }

    return normalized;
  }

  private async resolveOffers(offerIds: number[]): Promise<Offer[]> {
    const ids = [...new Set(offerIds.filter((id) => Number.isInteger(id) && id > 0))];

    if (!ids.length) {
      return [];
    }

    const offers = await this.offerRepository.find({
      where: { id: In(ids) },
    });

    if (offers.length !== ids.length) {
      throw new BadRequestException('Одна или несколько услуг не найдены');
    }

    return offers;
  }
}
