import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('breadcrumb')
export class Breadcrumb {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ unique: true, nullable: false })
  slug: string;

  @Column({ type: 'json' })
  items: { label: string; href: string }[];
}
