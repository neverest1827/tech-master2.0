import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity('promo')
export class Promo {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    badge: string;

    @Column()
    text: string;
}