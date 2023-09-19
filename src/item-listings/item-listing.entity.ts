import {
    BeforeInsert,
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToOne,
    PrimaryColumn,
    UpdateDateColumn,
} from 'typeorm';
import { v4 as uuid } from 'uuid';
import { DiabloItem } from '../diablo-items/diablo-item.entity';
import { User } from '../users/users.entity';

export enum ItemListingState {
    ACTIVE = 'ACTIVE',
    SOLD = 'SOLD',
    CLOSED = 'CLOSED',
}

@Entity('item_listing')
export class ItemListing {
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

    @BeforeInsert()
    generateUuid() {
        this.uuid = uuid();
    }

    @Column({ type: 'uuid', nullable: false, default: '' })
    uuid: string;

    @Column({
        type: 'integer',
        name: 'seller_id',
        nullable: false,
        transformer: {
            to: (value: number) => value, // When writing to the database
            from: (value: number | null) => value?.toString() ?? null, // When reading from the database
        },
    })
    sellerId: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'seller_id' })
    seller: User;

    @Column({
        type: 'integer',
        name: 'diablo_item_id',
        nullable: false,
        transformer: {
            to: (value: number) => value, // When writing to the database
            from: (value: number | null) => value?.toString() ?? null, // When reading from the database
        },
    })
    diabloItemId: string;

    @OneToOne(() => DiabloItem)
    @JoinColumn({ name: 'diablo_item_id' })
    diabloItem: DiabloItem;

    @Column({ type: 'integer', nullable: true })
    reservePrice: number | null;

    @Column({ type: 'integer', nullable: false, default: 0 })
    openingBid: number;

    @Column({ type: 'integer', nullable: true, default: 0 })
    bidIncrement: number | null;

    @Column({ type: 'integer', nullable: false })
    duration: number;

    @Column({ type: 'integer', nullable: true })
    buyNowPrice: number | null;

    @Column({ type: 'integer', nullable: true })
    currentBidPrice: number | null;

    @Column({ type: 'varchar', nullable: false, default: 'ACTIVE' })
    state: ItemListingState;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
