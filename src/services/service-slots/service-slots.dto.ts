import { API } from '@sanctuaryteam/shared';
import { fromEntity as userDtoFromEntity } from '../../users/user.dto';
import { fromEntity as serviceDtoFromEntity } from '../service.dto';
import { ServiceSlot } from './service-slots.entity';

interface FromEntityOptions {
    hideDiscriminator?: boolean;
}

export const fromEntity = (entity: ServiceSlot, options: FromEntityOptions = {}): API.ServiceSlotDto => {
    const {
        id,
        state,
        service,
        serviceId,
        serviceOwner,
        serviceOwnerUserId,
        client,
        clientUserId,
        updatedAt,
    } = entity;

    const { hideDiscriminator } = options;

    const clientDto = client ? userDtoFromEntity(client, { hideDiscriminator }) : undefined;
    const serviceOwnerDto = serviceOwner ? userDtoFromEntity(serviceOwner, { hideDiscriminator }) : undefined;
    const serviceDto = service ? serviceDtoFromEntity(service, { hideDiscriminator }) : undefined;

    return {
        id: String(id),
        state,
        updatedAt,
        client: clientDto,
        clientUserId: String(clientUserId),
        serviceOwner: serviceOwnerDto,
        serviceOwnerUserId: String(serviceOwnerUserId),
        service: serviceDto,
        serviceId: String(serviceId),
    };
};
