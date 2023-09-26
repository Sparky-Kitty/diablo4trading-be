import { API } from '@sanctuaryteam/shared';
import { fromEntity as userDtoFromEntity } from './../user.dto';
import { UserVouchDto, fromEntity as userVouchFromEntity } from './../user-vouch/user-vouch-dto'
import { fromEntity as serviceSlotDtoFromEntity } from './../../services/service-slots/service-slots.dto'; // Update this path as needed
import { ServiceSlot } from 'src/services/service-slots/service-slots.entity';
import { UserVouch } from '../user-vouch/user-vouch.entity';
import { ItemListingBid } from 'src/item-listings/item-listing-bids/item-listing-bid.entity';
import { User } from '../users.entity';
import { Service } from 'src/services/services.entity';

export interface UserNotificationDto {
    id: string;
    recipient: API.UserDto;
    recipientId?: number;
    reference: API.ServiceSlotDto | UserVouchDto; // | API.ItemListingBidDto
    referenceId?: number;
    referenceType: string;
    message: string;
    createdAt: Date;
}

interface FromEntityOptions {
    hideDiscriminator?: boolean;
}

export const fromEntity = (entity: UserVouch | ServiceSlot | ItemListingBid, recipient: User, options: FromEntityOptions = {}): UserNotificationDto => {
    const {
        uuid: serviceSlotUuid,
        client,
    } = entity instanceof ServiceSlot &&  entity;

    const {
        uuid: userVouchUuid,
        recipient: userVouchRecipient,
        reference: userVouchReference,
    } = entity instanceof UserVouch &&  entity;

    const { hideDiscriminator } = options;
    let id: string;

    let notification: Partial<UserNotificationDto> = {
        recipient: recipient && userDtoFromEntity(recipient),
    }

    // ServiceSlot Related Notifications
    if (entity instanceof ServiceSlot) {
        const clientDto = client && userDtoFromEntity(client, { hideDiscriminator });
        notification.reference = entity && serviceSlotDtoFromEntity(entity, { hideDiscriminator });
        notification.referenceType = 'ServiceSlot';
        id = serviceSlotUuid;
        switch (entity.state) {
            case API.ServiceSlotStates.Accepted:
                if (notification.recipient.id == notification.reference.clientUserId) {
                    notification.message =
                        'Your purhase was approved. Please mark when the service has ended.';
                } else {
                    notification.message = 'Please mark when the service has ended.';
                }
                break;
            case API.ServiceSlotStates.Rejected:
                if (notification.recipient.id == notification.reference.clientUserId) {
                    notification.message = 'Your purhase was rejected.';
                }
                break;
            default: // API.ServiceSlotStates.Pending
                if (notification.recipient.id == notification.reference.serviceOwnerUserId) {
                    notification.message =
                        `User with a score of ${clientDto.vouchScore} purchased your service.`;
                }
                break;
        }
    }  

    // UserVouch Related Notifications
    if (entity instanceof UserVouch) {
        notification.reference = entity && userVouchFromEntity(entity, { hideDiscriminator: false });
        notification.referenceType = 'UserVouch';
        id = userVouchUuid;
        
        const recipient = userVouchRecipient;
        const reference = userVouchReference;
        switch (entity.state) {
            case 1:
                break;
            default: // Default Open (0)
                if (reference instanceof Service) {
                    if (recipient.id == reference.userId) {
                        notification.message = `Please rate the client.`;
                    } else {
                        notification.message = `Please rate the service.`;
                    }
                } else {
                    if (recipient.id == reference.sellerId) {
                        notification.message = `Please rate the client.`;
                    } else {
                        notification.message = `Please rate the item.`;
                    }
                }
                break;
        }
    }      
    
    return {
        id,
        recipient: notification.recipient,
        reference: notification.reference,
        referenceType: notification.referenceType,
        message: notification.message,
        createdAt: notification.createdAt,
    };
};
