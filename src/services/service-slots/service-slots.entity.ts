import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryColumn,
    UpdateDateColumn,
} from 'typeorm';

import { API } from '@sanctuaryteam/shared';
import { User } from '../../users/users.entity';
import { Service } from '../services.entity';

@Entity({ name: 'service_slot' })
export class ServiceSlot {
    @PrimaryColumn({
        type: 'int',
        generated: true,
        update: false,
        transformer: {
            to: (value: number) => value,  // When writing to the database
            from: (value: number) => value.toString(),  // When reading from the database
        }
    })
    id: string;

    @Column({
        nullable: false,
        default: API.ServiceSlotStates.Pending,
    })
    state: API.ServiceSlotStates;

    @ManyToOne(() => Service, { nullable: false })
    @JoinColumn({ name: 'service_id' })
    service: Service;

    @Column({ 
        type: 'int', 
        name: 'service_id',
        transformer: {
            to: (value: number) => value,  // When writing to the database
            from: (value: number) => value.toString(),  // When reading from the database
        }
     })
    serviceId: string;

    /*
     This is 'redundant' information, but fetching service slots for a service owner will be a very common operation.
     Worth the tradeoff vs doing joins every time.
     */
    @ManyToOne(() => User, { nullable: false })
    @JoinColumn({ name: 'service_owner_user_id' })
    serviceOwner: User;

    @Column({ 
        type: 'int', 
        name: 'service_owner_user_id',
        transformer: {
            to: (value: number) => value,  // When writing to the database
            from: (value: number) => value.toString(),  // When reading from the database
        } 
    })
    serviceOwnerUserId: string;

    @ManyToOne(() => User, { nullable: false })
    @JoinColumn({ name: 'client_user_id' })
    client: User;

    @Column({ 
        type: 'int', 
        name: 'client_user_id',
        transformer: {
            to: (value: number) => value,  // When writing to the database
            from: (value: number) => value.toString(),  // When reading from the database
        } 
    })
    clientUserId: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
