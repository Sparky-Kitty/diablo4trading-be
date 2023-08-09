import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { User } from '../users/users.entity';

@Entity({ name: 'service' })
export class YourEntityName {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: false,
  })
  realm_type: number;

  @Column({ type: 'varchar', length: 100, nullable: false })
  title: string;

  @Column({ type: 'varchar', length: 1000, nullable: false, default: '' })
  content: string;

  @ManyToOne(() => User)
  user: User;

  @Column({ nullable: false, default: 1 })
  tags: number;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  bumped_at: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => User)
  updated_by: string;

  @Column({ type: 'boolean', default: false })
  deleted: boolean;
}
