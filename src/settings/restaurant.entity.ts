import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn } from 'typeorm';

@Entity('restaurant_details')
export class RestaurantDetail {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: 'RestoBill' })
  name: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  gstin: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  tagline: string;

  @UpdateDateColumn()
  updatedAt: Date;
}
