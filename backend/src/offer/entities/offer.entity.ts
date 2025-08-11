import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    Index, OneToOne, JoinColumn,
} from 'typeorm';
import {Meta} from "../../meta/entities/meta.entity";

@Entity('offer')
export class Offer {
    @PrimaryGeneratedColumn()
    id: number;

    @Index({ unique: true })
    @Column({ type: 'varchar', length: 255 })
    slug: string;

    @Column({ type: 'text', nullable: true })
    content: string;

    @OneToOne(() => Meta, (meta) => meta.offer, { cascade: true })
    @JoinColumn()
    meta: Meta;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
