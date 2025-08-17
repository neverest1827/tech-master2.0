import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    BeforeUpdate,
    BeforeInsert, OneToOne, JoinColumn, OneToMany
} from 'typeorm';
import {Meta} from "../../meta/entities/meta.entity";
import {Faq} from "../../faq/entities/faq.entity";

@Entity('blog_posts')
export class BlogPost {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('text')
    content: string;

    @Column({ nullable: true })
    previewImageURL: string;

    @Column({ length: 255, unique: true })
    slug: string;

    @OneToOne(() => Meta, meta => meta.blogPost)
    @JoinColumn()
    meta: Meta;

    @OneToMany(() => Faq, (faq) => faq.blogPost)
    faqs: Faq[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
