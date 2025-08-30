import {Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {BlogPost} from "../../blog/entities/blog-post.entity";
import {Offer} from "../../offer/entities/offer.entity";

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

    @ManyToMany(() => Offer, (offer) => offer.faqs )
    @JoinTable({ name: 'faq_offer' })
    offer: Offer[];
}
