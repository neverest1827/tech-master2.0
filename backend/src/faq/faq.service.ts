import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateFaqDto } from './dto/create-faq.dto';
import { UpdateFaqDto } from './dto/update-faq.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Faq } from './entities/faq.entity';

@Injectable()
export class FaqService {
  constructor(
    @InjectRepository(Faq)
    private readonly faqRepository: Repository<Faq>,
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
    return this.faqRepository.find();
  }

  /**
   * Ищет и возвращает запись FAQ по ее ID.
   * @param id Идентификатор записи FAQ.
   * @returns Возвращает объект FAQ.
   * @throws {NotFoundException} Если запись не найдена.
   */
  async findOne(id: number): Promise<Faq> {
    const faq: Faq | null = await this.faqRepository.findOneBy({ id });

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
}
