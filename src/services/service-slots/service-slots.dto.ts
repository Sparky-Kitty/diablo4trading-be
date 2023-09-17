import { API } from '@sanctuaryteam/shared';
import { UserDto, fromEntity as userDtoFromEntity } from '../../users/user.dto';
import { ServiceDto, fromEntity as serviceDtoFromEntity } from '../service.dto';
import { ServiceSlot } from './service-slots.entity';
import { IServiceSlot } from './service-slots.interface'; // Assuming you've named your interface IServiceSlot

export interface ServiceSlotDto extends IServiceSlot {
    id: number;
    state: API.ServiceSlotStates;
    service: ServiceDto;
    serviceId?: number;
    serviceOwner: UserDto;
    serviceOwnerUserId: number;
    client: UserDto;
    clientUserId: number;
    updatedAt: Date;
}

export const fromEntity = (entity: ServiceSlot): ServiceSlotDto => {
    const {
        id, state, service, serviceId, serviceOwner, serviceOwnerUserId,
        client, clientUserId, updatedAt
    } = entity;

    const clientDto = client ? userDtoFromEntity(client, {hideDiscriminator: true}) : undefined;
    const serviceOwnerDto = serviceOwner ? userDtoFromEntity(serviceOwner) : undefined;
    const serviceDto = service ? serviceDtoFromEntity(service) : undefined;

    return {
        id,
        state,
        updatedAt,
        client: clientDto,
        clientUserId,
        serviceOwner: serviceOwnerDto,
        serviceOwnerUserId,
        service: serviceDto,
        serviceId,
    };
}