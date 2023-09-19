import { ItemListing } from 'src/item-listings/item-listing.entity';
import { Service } from 'src/services/services.entity';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { PolymorphicParent } from 'typeorm-polymorphic';
import { User } from '../users.entity';
import { UserVouchState } from './user-vouch-state.enum';

@Entity('user_vouch')
export class UserVouch {
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
        type: 'integer',
        transformer: {
            to: (value: number) => value, // When writing to the database
            from: (value: number | null) => value?.toString() ?? null, // When reading from the database
        },
    })
    recipientId: string;

    @Column({
        type: 'integer',
        transformer: {
            to: (value: number) => value, // When writing to the database
            from: (value: number | null) => value?.toString() ?? null, // When reading from the database
        },
    })
    authorId: string;

    @Column()
    referenceType: string;

    @Column({
        type: 'integer',
        transformer: {
            to: (value: number) => value, // When writing to the database
            from: (value: number | null) => value?.toString() ?? null, // When reading from the database
        },
    })
    referenceId: string;

    @Column()
    isPositive: boolean;

    @Column()
    rating: number;

    @Column({ type: 'text' })
    description: string;

    @Column()
    state: UserVouchState;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'recipient_id' })
    recipient: User;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'author_id' })
    author: User;

    @PolymorphicParent(() => [ItemListing, Service])
    reference: ItemListing | Service;

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
