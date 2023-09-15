import { UserDto } from 'src/users/user.dto';
import { API } from '@sanctuaryteam/shared';
import { ServiceDto } from '../service.dto';

export interface IServiceSlot {
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
