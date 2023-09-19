import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { User } from '../users.entity';

@Entity('user_vouch_calculation')
export class UserVouchCalculation {
    @PrimaryGeneratedColumn()
    id: number;

    @OneToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ 
        type: 'int',
        transformer: {
            to: (value: number) => value,  // When writing to the database
            from: (value: number) => value.toString(),  // When reading from the database
        } 
    })
    userId: string;

    @Column({ type: 'integer' })
    score: number;

    @Column({ type: 'float' })
    rating: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
