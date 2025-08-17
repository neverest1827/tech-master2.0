import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {BlogPost} from "../../blog/entities/blog-post.entity";

@Entity('faq')
export class Faq {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'text'})
    question: string;

    @Column({type: 'text'})
    answer: string;

    @ManyToOne(() => BlogPost, (blogPost: BlogPost): Faq[] => blogPost.faqs)
    @JoinColumn()
    blogPost: BlogPost;
}
