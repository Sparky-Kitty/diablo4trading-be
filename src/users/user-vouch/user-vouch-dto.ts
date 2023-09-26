import { API } from '@sanctuaryteam/shared';
import { fromEntity as userDtoFromEntity } from './../user.dto';
import { fromEntity as serviceDtoFromEntity } from './../../services/service.dto';
import { UserVouch } from '../user-vouch/user-vouch.entity';
import { Service } from 'src/services/services.entity';
import { UserVouchState } from './user-vouch-state.enum';
import { ItemListing } from 'src/item-listings/item-listing.entity';

export interface UserVouchDto {
    id: string;
    recipient: API.UserDto;
    recipientId: string;
    reference: API.ServiceDto | ItemListing; // || API.ItemListingDto
    referenceId: string;
    referenceType: string;
    isPositive: boolean;
    rating: number;
    state: UserVouchState;
    description: string;
    createdAt: Date;
}

interface FromEntityOptions {
    hideDiscriminator?: boolean;
}

export const fromEntity = (entity: UserVouch, options: FromEntityOptions = {}): UserVouchDto => {
    const {
        uuid,
        recipient,
        state,
        reference,
        isPositive,
        rating,
        description,
        createdAt,
    } = entity

    const { hideDiscriminator } = options;
    const recipientDto = recipient && userDtoFromEntity(recipient, { hideDiscriminator });
    // const referenceDto = reference instanceof Service && serviceDtoFromEntity(reference, { hideDiscriminator });
    const referenceTypeString = reference instanceof Service ? 'Service' : 'ItemListing';
    const referenceDto = reference instanceof Service && serviceDtoFromEntity(reference, { hideDiscriminator: false });
    
    
    return {
        id: uuid,
        recipient: recipientDto,
        recipientId: recipientDto.id,
        reference: referenceDto,
        referenceId: referenceDto ? referenceDto.id : String(reference.id),
        referenceType: referenceTypeString,
        description,
        rating,
        state,
        createdAt,
        isPositive,
    };
};
