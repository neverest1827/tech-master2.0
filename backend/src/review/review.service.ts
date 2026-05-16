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
      take: count,
      order: { createdAt: 'DESC' },
    });
  }

  async paginate(page: number, limit: number) {
    const [data, total] = await this.reviewRepository.findAndCount({
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

  /**
   * Удаляет отзыв по ID.
   *
   * @param id - Идентификатор отзыва
   */
  async remove(id: number) {
    const review: Review = await this.findOne(id);
    await this.reviewRepository.remove(review);
  }
}
