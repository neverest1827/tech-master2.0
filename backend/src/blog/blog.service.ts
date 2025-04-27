import {Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {In, Repository} from 'typeorm';
import {BlogPost} from './entities/blog-post.entity';
import {CreateBlogPostDto} from './dto/create-blog-post.dto';
import {UpdateBlogPostDto} from './dto/update-blog-post.dto';

@Injectable()
export class BlogService {
    constructor(
        @InjectRepository(BlogPost)
        private readonly blogRepository: Repository<BlogPost>,
    ) {
    }

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
            order: {createdAt: 'DESC'},
        });
    }

    /**
     * Находит блог-пост по идентификатору.
     * @param {number} id - Идентификатор поста.
     * @throws {NotFoundException} Если пост не найден.
     * @returns {Promise<BlogPost>} Найденный блог-пост.
     */
    async findOne(id: number): Promise<BlogPost> {
        const blogPost: BlogPost | null = await this.blogRepository.findOneBy({id});

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
        });
    }

    /**
     * Находит блог-пост по slug.
     * @param {string} slug - Уникальный идентификатор поста.
     * @throws {NotFoundException} Если пост не найден.
     * @returns {Promise<BlogPost>} Найденный блог-пост.
     */
    async findBySlug(slug: string): Promise<BlogPost> {
        const blogPost: BlogPost | null = await this.blogRepository.findOne({where: {slug}});

        if (!blogPost) {
            throw new NotFoundException('Статья не найдена');
        }

        return blogPost;
    }

    /**
     * Обновляет существующий блог-пост.
     * @param {number} id - Идентификатор поста.
     * @param {UpdateBlogPostDto} updateBlogDto - Данные для обновления поста.
     * @returns {Promise<BlogPost>} Обновленный блог-пост.
     */
    async update(id: number, updateBlogDto: UpdateBlogPostDto): Promise<BlogPost> {
        const blogPost: BlogPost = await this.findOne(id);
        const updated: BlogPost = Object.assign(blogPost, updateBlogDto);
        return this.blogRepository.save(updated);
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
}