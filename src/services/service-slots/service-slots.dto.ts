import { UserDto } from '../../users/user.dto';
import { IServiceSlot } from './service-slots.interface'; // Assuming you've named your interface IServiceSlot
import { API } from '@sanctuaryteam/shared';
import { ServiceSlot } from './service-slots.entity';
import { ServiceDto } from '../service.dto';

export class ServiceSlotDto implements IServiceSlot {
    id: number;
    state: API.ServiceSlotStates;
    service: ServiceDto;
    serviceId?: number;
    serviceOwner: UserDto;
    serviceOwnerUserId: number;
    client: UserDto;
    clientUserId: number;
    updatedAt: Date;

    static fromEntity(entity: ServiceSlot): ServiceSlotDto {
        const dto = new ServiceSlotDto();
        dto.id = entity.id;
        dto.state = entity.state;
        dto.service = ServiceDto.fromEntity(entity.service);
        dto.serviceOwnerUserId = entity.serviceOwnerUserId;
        dto.clientUserId = entity.clientUserId;

        // Using UserDto.fromEntity to convert the client entity to UserDto
        if (entity.client) {
            dto.client = UserDto.fromEntity(entity.client);
        }
        if (entity.serviceOwner) {
            dto.serviceOwner = UserDto.fromEntity(entity.serviceOwner);
        }

        return dto;
    }
}
