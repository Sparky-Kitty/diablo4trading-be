import { API } from '@sanctuaryteam/shared';
import { fromEntity as userDtoFromEntity } from '../users/user.dto';
import { fromEntity as serviceSlotDtoFromEntity } from './service-slots/service-slots.dto'; // Update this path as needed
import { Service } from './services.entity';

interface FromEntityOptions {
    hideDiscriminator?: boolean;
}

export const fromEntity = (entity: Service, options: FromEntityOptions = {}): API.ServiceDto => {
    const {
        id,
        realmType,
        title,
        content,
        userId,
        tags,
        maxAcceptedSlots,
        slots,
        bumpedAt,
        createdAt,
        updatedAt,
        updatedBy,
        deleted,
        user,
    } = entity;

    const { hideDiscriminator } = options;

    const userDto = user ? userDtoFromEntity(user, { hideDiscriminator }) : undefined;
    const serviceSlotsDto: API.ServiceSlotDto[] = [];

    Array.isArray(slots)
        && slots.forEach(slot => serviceSlotsDto.push(serviceSlotDtoFromEntity(slot, { hideDiscriminator })));

    return {
        id: String(id),
        realmType,
        title,
        content,
        userId: String(userId),
        tags,
        maxAcceptedSlots,
        slots: serviceSlotsDto,
        bumpedAt,
        createdAt,
        updatedAt,
        updatedBy,
        deleted,
        user: userDto,
    };
};
