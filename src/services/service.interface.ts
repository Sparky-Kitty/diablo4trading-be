import { UserDto } from 'src/users/user.dto';
import { ServiceSlotDto } from './service-slots/service-slots.dto';

export interface IService {
    id: number;
    realmType: string;
    title: string;
    content: string;
    user: UserDto;
    userId: number;
    tags: number;
    maxAcceptedSlots: number;
    slots: ServiceSlotDto[];
    bumpedAt: Date;
    createdAt: Date;
    updatedAt: Date;
    updatedBy: string;
    deleted: boolean;
}
