import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { BlogPost } from './entities/blog-post.entity';
import { CreateBlogPostDto } from './dto/create-blog-post.dto';
import { UpdateBlogPostDto } from './dto/update-blog-post.dto';
import { Meta } from '../meta/entities/meta.entity';
import slugify from 'slugify';

export type AdminBlogPostInput = {
  slug?: string;
  title: string;
  description: string;
  content: string;
  previewImageURL?: string;
  keywords?: string;
};

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(BlogPost)
    private readonly blogRepository: Repository<BlogPost>,
    @InjectRepository(Meta)
    private readonly metaRepository: Repository<Meta>,
  ) {}

  /**
   * Создает новый блог-пост.
   * @param {CreateBlogPostDto} createBlogDto - Данные для создания поста.
   * @returns {Promise<BlogPost>} Созданный блог-пост.
   */
  async create(createBlogDto: CreateBlogPostDto): Promise<BlogPost> {
    const blogPost: BlogPost = this.blogRepository.create(createBlogDto);
    return this.blogRepository.save(blogPost);
  }

  /**
   * Получает все блог-посты, отсортированные по дате создания (от новых к старым).
   * @returns {Promise<BlogPost[]>} Массив блог-постов.
   */
  async findAll(): Promise<BlogPost[]> {
    return this.blogRepository.find({
      order: { createdAt: 'DESC' },
      relations: ['meta'],
    });
  }

  /**
   * Находит блог-пост по идентификатору.
   * @param {number} id - Идентификатор поста.
   * @throws {NotFoundException} Если пост не найден.
   * @returns {Promise<BlogPost>} Найденный блог-пост.
   */
  async findOne(id: number): Promise<BlogPost> {
    const blogPost: BlogPost | null = await this.blogRepository.findOne({
      where: { id },
      relations: ['meta', 'faqs'],
    });

    if (!blogPost) {
      throw new NotFoundException(`Статья #${id} не найдена`);
    }

    return blogPost;
  }

  /**
   * Находит несколько блог-постов по их идентификаторам.
   * @param {number[]} ids - Массив идентификаторов постов.
   * @returns {Promise<BlogPost[]>} Массив найденных блог-постов.
   */
  async findMany(ids: number[]): Promise<BlogPost[]> {
    return this.blogRepository.find({
      where: {
        id: In(ids),
      },
      relations: ['meta'],
    });
  }

  /**
   * Находит блог-пост по slug.
   * @param {string} slug - Уникальный идентификатор поста.
   * @throws {NotFoundException} Если пост не найден.
   * @returns {Promise<BlogPost>} Найденный блог-пост.
   */
  async findBySlug(slug: string): Promise<BlogPost> {
    const blogPost: BlogPost | null = await this.blogRepository.findOne({
      where: { slug },
      relations: ['meta', 'faqs'],
    });

    if (!blogPost) {
      throw new NotFoundException('Статья не найдена');
    }

    return blogPost;
  }

  async paginate(page: number, limit: number) {
    const posts = await this.blogRepository.find({
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
      relations: ['meta'],
    });

    return posts.map((post) => ({
      slug: post.slug,
      previewImageURL: post.previewImageURL,
      title: post.meta.title,
      description: post.meta.description,
    }));
  }

  /**
   * Обновляет существующий блог-пост.
   * @param {number} id - Идентификатор поста.
   * @param {UpdateBlogPostDto} updateBlogDto - Данные для обновления поста.
   * @returns {Promise<BlogPost>} Обновленный блог-пост.
   */
  async update(
    id: number,
    updateBlogDto: UpdateBlogPostDto,
  ): Promise<BlogPost> {
    const blogPost: BlogPost = await this.findOne(id);
    const updated: BlogPost = Object.assign(blogPost, updateBlogDto);
    return this.blogRepository.save(updated);
  }

  async createForAdmin(input: AdminBlogPostInput): Promise<BlogPost> {
    const normalized = this.normalizeAdminInput(input);
    await this.ensureUniqueSlug(normalized.slug);

    const meta = this.metaRepository.create({
      pageName: `blog-${normalized.slug}`,
      title: normalized.title,
      description: normalized.description,
      keywords: normalized.keywords,
      canonicalUrl: `/blog/${normalized.slug}`,
      robots: 'index, follow',
      ogImage: normalized.previewImageURL,
      ogUrl: `/blog/${normalized.slug}`,
      ogType: 'article',
      twitterCard: 'summary_large_image',
      twitterImage: normalized.previewImageURL,
    });
    const savedMeta = await this.metaRepository.save(meta);

    try {
      const blogPost = this.blogRepository.create({
        slug: normalized.slug,
        content: normalized.content,
        previewImageURL: normalized.previewImageURL,
        meta: savedMeta,
      });

      return await this.blogRepository.save(blogPost);
    } catch (error) {
      await this.metaRepository.remove(savedMeta);
      throw error;
    }
  }

  async updateForAdmin(
    id: number,
    input: AdminBlogPostInput,
  ): Promise<BlogPost> {
    const blogPost = await this.findOne(id);
    const normalized = this.normalizeAdminInput(input);

    await this.ensureUniqueSlug(normalized.slug, id);

    blogPost.slug = normalized.slug;
    blogPost.content = normalized.content;
    blogPost.previewImageURL = normalized.previewImageURL;
    blogPost.meta.title = normalized.title;
    blogPost.meta.description = normalized.description;
    blogPost.meta.keywords = normalized.keywords;
    blogPost.meta.canonicalUrl = `/blog/${normalized.slug}`;
    blogPost.meta.ogImage = normalized.previewImageURL;
    blogPost.meta.ogUrl = `/blog/${normalized.slug}`;
    blogPost.meta.ogType = 'article';
    blogPost.meta.twitterCard = 'summary_large_image';
    blogPost.meta.twitterImage = normalized.previewImageURL;

    await this.metaRepository.save(blogPost.meta);
    return this.blogRepository.save(blogPost);
  }

  /**
   * Удаляет блог-пост по идентификатору.
   * @param {number} id - Идентификатор поста.
   * @throws {NotFoundException} Если пост не найден.
   * @returns {Promise<void>} Ничего не возвращает.
   */
  async remove(id: number): Promise<void> {
    const blogPost: BlogPost = await this.findOne(id);
    await this.blogRepository.remove(blogPost);
  }

  private normalizeAdminInput(input: AdminBlogPostInput) {
    const title = this.requireText(input.title, 'Заголовок');
    const description = this.requireText(input.description, 'Описание');
    const content = this.requireText(input.content, 'HTML статьи');
    const slug = slugify(input.slug?.trim() || title, {
      lower: true,
      strict: true,
      locale: 'ru',
    });

    if (!slug) {
      throw new BadRequestException('Не удалось сформировать slug статьи');
    }

    return {
      slug,
      title,
      description,
      content,
      previewImageURL: input.previewImageURL?.trim() || '',
      keywords: input.keywords?.trim() || '',
    };
  }

  private requireText(value: string, field: string): string {
    const normalized = String(value || '').trim();

    if (!normalized) {
      throw new BadRequestException(`${field} не может быть пустым`);
    }

    return normalized;
  }

  private async ensureUniqueSlug(slug: string, currentId?: number) {
    const existing = await this.blogRepository.findOne({ where: { slug } });

    if (existing && existing.id !== currentId) {
      throw new BadRequestException(`Slug "${slug}" уже используется`);
    }
  }
}
