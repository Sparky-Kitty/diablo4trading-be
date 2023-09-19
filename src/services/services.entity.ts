import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryColumn,
    UpdateDateColumn,
} from 'typeorm';

import { User } from '../users/users.entity';
import { ServiceSlot } from './service-slots/service-slots.entity';

@Entity({ name: 'service' })
export class Service {
    @PrimaryColumn({
        type: 'integer',
        generated: true,
        update: false,
        transformer: {
            to: (value: number) => value, // When writing to the database
            from: (value: number | null) => value?.toString() ?? null, // When reading from the database
        },
    })
    id: string;

    @Column({
        nullable: false,
    })
    realmType: string;

    @Column({ type: 'varchar', length: 100, nullable: false })
    title: string;

    @Column({ type: 'varchar', length: 1000, nullable: false, default: '' })
    content: string;

    @ManyToOne(() => User, user => user.services)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({
        type: 'integer',
        name: 'user_id',
        nullable: false,
        transformer: {
            to: (value: number) => value, // When writing to the database
            from: (value: number | null) => value?.toString() ?? null, // When reading from the database
        },
    })
    userId: string;

    @Column({ nullable: false, default: 1 })
    tags: number;

    @Column({ nullable: false, default: 3 })
    maxAcceptedSlots: number;

    @OneToMany(type => ServiceSlot, slot => slot.service)
    slots: ServiceSlot[];

    @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
    bumpedAt: Date;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'updated_by' })
    updatedBy: string;

    @Column({ type: 'boolean', default: false })
    deleted: boolean;
}
