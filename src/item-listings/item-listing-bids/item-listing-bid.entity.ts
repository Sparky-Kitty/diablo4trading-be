import { User } from 'src/users/users.entity';
import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToOne,
    PrimaryColumn,
    UpdateDateColumn,
} from 'typeorm';
import { ItemListing } from '../item-listing.entity';

@Entity('item_listing_bid')
export class ItemListingBid {
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
        transformer: {
            to: (value: number) => value, // When writing to the database
            from: (value: number | null) => value?.toString() ?? null, // When reading from the database
        },
    })
    userId: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({
        nullable: false,
        transformer: {
            to: (value: number) => value, // When writing to the database
            from: (value: number | null) => value?.toString() ?? null, // When reading from the database
        },
    })
    itemListingId: string;

    @OneToOne(() => ItemListing)
    @JoinColumn({ name: 'item_listing_id' })
    itemListing: ItemListing;

    @Column({ nullable: true })
    bidAmount: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @Column({ type: 'boolean', default: false })
    deleted: boolean;
}
