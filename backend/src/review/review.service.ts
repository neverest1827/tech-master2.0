import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './entities/review.entity';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
  ) {}

  /**
   * Создает новый отзыв и сохраняет его в базе данных.
   *
   * @param createReviewDto - DTO с данными нового отзыва
   * @returns Созданный отзыв
   */
  create(createReviewDto: CreateReviewDto): Promise<Review> {
    const review: Review = this.reviewRepository.create(createReviewDto);
    return this.reviewRepository.save(review);
  }

  /**
   * Возвращает указанное количество последних отзывов.
   *
   * @param count - Количество отзывов для получения
   * @returns Массив отзывов
   */
  async findMany(count: number): Promise<Review[]> {
    return await this.reviewRepository.find({
      where: { isApproved: true },
      take: count,
      order: { createdAt: 'DESC' },
    });
  }

  async paginate(page: number, limit: number) {
    const [data, total] = await this.reviewRepository.findAndCount({
      where: { isApproved: true },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      reviews: data.map((review) => ({
        id: review.id,
        name: review.name,
        date: review.createdAt.toISOString().split('T')[0],
        stars: review.stars,
        text: review.text,
      })),
      total,
    };
  }

  async findAllForAdmin(): Promise<Review[]> {
    const reviews = await this.reviewRepository.find({
      order: {
        isApproved: 'ASC',
        createdAt: 'DESC',
      },
    });

    return reviews.map((review) => {
      review.isApproved = this.normalizeApprovedValue(review.isApproved);
      return review;
    });
  }

  /**
   * Ищет один отзыв по ID.
   *
   * @param id - Идентификатор отзыва
   * @throws NotFoundException если отзыв не найден
   * @returns Найденный отзыв
   */
  async findOne(id: number): Promise<Review> {
    const review: Review | null = await this.reviewRepository.findOne({
      where: { id },
    });

    if (!review) {
      throw new NotFoundException(`Отзыв #${id} не найден`);
    }

    return review;
  }

  /**
   * Обновляет отзыв по ID.
   *
   * @param id - Идентификатор отзыва
   * @param updateReviewDto - DTO с новыми данными
   * @returns Обновленный отзыв
   */
  async update(id: number, updateReviewDto: UpdateReviewDto) {
    const review: Review = await this.findOne(id);
    const updated: Review = Object.assign(review, updateReviewDto);
    return await this.reviewRepository.save(updated);
  }

  async setApproved(id: number, isApproved: boolean): Promise<Review> {
    await this.reviewRepository.update({ id }, { isApproved });

    return await this.findOne(id);
  }

  async updateText(id: number, text: string): Promise<Review> {
    const review: Review = await this.findOne(id);
    review.text = text;

    return await this.reviewRepository.save(review);
  }

  /**
   * Удаляет отзыв по ID.
   *
   * @param id - Идентификатор отзыва
   */
  async remove(id: number) {
    const review: Review = await this.findOne(id);
    await this.reviewRepository.remove(review);
  }

  private normalizeApprovedValue(value: unknown): boolean {
    if (typeof value === 'boolean') {
      return value;
    }

    if (typeof value === 'number') {
      return value === 1;
    }

    if (typeof value === 'string') {
      return value === '1' || value.toLowerCase() === 'true';
    }

    if (Buffer.isBuffer(value)) {
      return value.length > 0 && value[0] === 1;
    }

    return false;
  }
}
