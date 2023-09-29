import { API } from '@sanctuaryteam/shared';
import { ItemListingBid } from 'src/item-listings/item-listing-bids/item-listing-bid.entity';
import { ServiceSlot } from './../../services/service-slots/service-slots.entity';
import { Service } from 'src/services/services.entity';
import { fromEntity as serviceSlotDtoFromEntity } from './../../services/service-slots/service-slots.dto';
import { fromEntity as userVouchFromEntity, UserVouchDto } from './../user-vouch/user-vouch-dto';
import { UserVouch } from '../user-vouch/user-vouch.entity';
import { fromEntity as userDtoFromEntity } from './../user.dto';
import { User } from '../users.entity';

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

const referenceNotification = (entity: ServiceSlot | UserVouch | ItemListingBid, notification: UserNotificationDto, options: FromEntityOptions = {}, client?: User): UserNotificationDto => {   
    const { hideDiscriminator } = options;

    // ServiceSlot Related Notifications
    if (entity instanceof ServiceSlot) {
        const clientDto = client && userDtoFromEntity(client, { hideDiscriminator });
        notification.referenceType = 'ServiceSlot';
        notification.id = entity.uuid;
        /*switch (entity.state) {
            case API.ServiceSlotStates.Accepted:
                if (notification.recipient.id == notification.reference.clientUserId) {
                    notification.message = 'Your purhase was approved. Please mark when the service has ended.';
                } else {
                    notification.message = 'Please mark when the service has ended.';
                }
                break;
            case API.ServiceSlotStates.Rejected:
                if (notification.recipient.id == notification.reference.clientUserId) {
                    notification.message = 'Your purhase was rejected.';
                }
                break;
            case API.ServiceSlotStates.Ended:
                return null;
            default: // API.ServiceSlotStates.Pending
                if (notification.recipient.id == notification.reference.serviceOwnerUserId) {
                    notification.message = `User with a score of ${clientDto.vouchScore} purchased your service.`;
                }
                break;
        }*/
    }

    // UserVouch Related Notifications
    if (entity instanceof UserVouch && notification.reference instanceof UserVouch) {
        notification.referenceType = 'UserVouch';
        notification.id = entity.uuid;

        const recipient = entity.recipient;
        const reference = entity.reference;
        switch (entity.state) {
            case 1:
                break;
            default: // Default Open (0)
                /*if (reference instanceof Service) {
                    if (recipient.id == notification.reference.userId) {
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
                break;*/
        }
    }
    return notification;
}

export const fromEntity = (
    entity: UserVouch | ServiceSlot | ItemListingBid,
    recipient: User,
    options: FromEntityOptions = {},
): UserNotificationDto => {
    const {
        client,
    } = entity instanceof ServiceSlot && entity;

    const {} = entity instanceof UserVouch && entity;

    let notification: UserNotificationDto = {
        id: '',
        recipient: recipient && userDtoFromEntity(recipient),
        reference: entity instanceof ServiceSlot ? serviceSlotDtoFromEntity(entity, { hideDiscriminator: entity.state === API.ServiceSlotStates.Pending }) : entity instanceof UserVouch && entity && userVouchFromEntity(entity, { hideDiscriminator: false }),
        referenceType:  'unknown',
        message: 'null',
        createdAt: new Date(),
    };

    let fullNotification: UserNotificationDto | null;

    try {
        fullNotification = referenceNotification(entity, notification, options, client);
        console.log("Full Notification: " + JSON.stringify(fullNotification));

        if (fullNotification !== null) {
            return {
                id: fullNotification.id,
                recipient: fullNotification.recipient,
                reference: fullNotification.reference,
                referenceType: fullNotification.referenceType,
                message: fullNotification.message,
                createdAt: fullNotification.createdAt,
            };
        } else {
            // Handle the case where referenceNotification returns null.
            // You can return a default value or take appropriate action.
            console.error("Reference notification is null.");
            // Return a default value or throw an error if necessary.
        }
    } catch (error) {
        // Handle any errors that might occur during the referenceNotification call.
        // You can log the error or take appropriate action as needed.
        console.error("Error while creating full notification:", error);
        // Throw the error if necessary.
    }

    // const fullNotification = referenceNotification(entity, notification, options, client)
    // console.log("Full Notifiation: " + fullNotification)

    return {
        id: fullNotification?.id ?? '',
        recipient: fullNotification.recipient,
        reference: fullNotification.reference,
        referenceType: fullNotification.referenceType,
        message: fullNotification.message,
        createdAt: fullNotification.createdAt,
    };
};
