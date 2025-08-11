import {Column, Entity, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {Offer} from "../../offer/entities/offer.entity";

@Entity('meta')
export class Meta {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique: true, nullable: false})
    pageName: string;

    // SEO
    @Column()
    title: string;

    @Column({ nullable: true })
    description: string;

    @Column({ nullable: true })
    keywords: string;

    // OpenGraph

    @Column({ nullable: true })
    ogImage: string;

    @Column({ nullable: true })
    ogUrl: string;

    @Column({ nullable: true })
    ogType: string;


    // Twitter
    @Column({ nullable: true })
    twitterCard: string;

    @Column({ nullable: true })
    twitterImage: string;


    // Technical
    @Column({ nullable: true })
    canonicalUrl: string;

    @Column({ default: 'index, follow' })
    robots: string;


    @OneToOne(() => Offer, (offer) => offer.meta)
    offer: Offer;
}
