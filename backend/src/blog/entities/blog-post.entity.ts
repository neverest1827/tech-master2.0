import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    BeforeUpdate,
    BeforeInsert
} from 'typeorm';
import slugify from "slugify";

@Entity('blog_posts')
export class BlogPost {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 255 })
    title: string;

    @Column('text')
    content: string;

    @Column({ length: 500 })
    description: string;

    @Column({ nullable: true })
    previewImage: string;

    @Column({ nullable: true })
    ogImage: string;

    @Column({ nullable: true })
    metaTitle: string;

    @Column({ nullable: true })
    metaDescription: string;

    @Column({ nullable: true })
    metaKeywords: string;

    @Column({ length: 255, unique: true })
    slug: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @BeforeInsert()
    @BeforeUpdate()
    generateSlug() {
        if (this.title) {
            this.slug = slugify(this.title, { lower: true, strict: true });
        }
    }
}
