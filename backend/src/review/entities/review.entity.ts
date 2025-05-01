import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity('reviews')
export class Review {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 30 })
    name: string;

    @Column('text')
    text: string;

    @Column({ type: 'int', unsigned: true })
    stars: number;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;
}
