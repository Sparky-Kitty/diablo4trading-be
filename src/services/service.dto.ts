import { UserDto, fromEntity as userDtoFromEntity } from '../users/user.dto';
import { ServiceSlotDto, fromEntity as serviceSlotDtoFromEntity } from './service-slots/service-slots.dto'; // Update this path as needed
import { Service } from './services.entity';

export interface ServiceDto {
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

export const fromEntity = (entity: Service): ServiceDto => {
    const {
        id, realmType, title, content, userId, tags, 
        maxAcceptedSlots, slots, bumpedAt, createdAt, 
        updatedAt, updatedBy, deleted, user
    } = entity;

    const userDto = user ? userDtoFromEntity(user) : undefined;
    let serviceSlotsDto: ServiceSlotDto[];
    slots.map(slot => {
        serviceSlotsDto.push(slot ? serviceSlotDtoFromEntity(slot) : undefined)
    })

    return {
        id,
        realmType,
        title,
        content,
        userId,
        tags,
        maxAcceptedSlots,
        slots: serviceSlotsDto,
        bumpedAt,
        createdAt,
        updatedAt,
        updatedBy,
        deleted,
        user: userDto
    };
}