import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';

import { User } from '../users/users.entity';

@Entity({ name: 'service' })
export class Service {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: false,
  })
  realm_type: string;

  @Column({ type: 'varchar', length: 100, nullable: false })
  title: string;

  @Column({ type: 'varchar', length: 1000, nullable: false, default: '' })
  content: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ nullable: false, default: 1 })
  tags: number;

  @Column({ nullable: false, default: 3 })
  max_slots: number;

  @Column({ nullable: false, default: 3 })
  available_slots: number;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  bumped_at: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'updated_by' })
  updated_by: string;

  @Column({ type: 'boolean', default: false })
  deleted: boolean;
}
