import { fromEntity, UserNotificationDto } from './user-notification.dto';
import { User } from '../users.entity';
import { ServiceSlot } from 'src/services/service-slots/service-slots.entity';
import { API } from '@sanctuaryteam/shared';

describe('User Notifications', () => {
    let user: User;
    let serviceSlot: ServiceSlot;

    beforeEach(() => {
        user = new User();
        user.id = 1;
        // Fun thing to look at: comment this out and watch things break
        user.battleNetTag = 'test#1234';

        serviceSlot = new ServiceSlot();
        serviceSlot.uuid = 'some-uuid';
        serviceSlot.state = API.ServiceSlotStates.Pending;
        serviceSlot.client = user;
        // Fun thing to look at: comment this out and watch things break
        serviceSlot.updatedAt = new Date();
    });

    describe('fromEntity', () => {
        it('should return a UserNotificationDto object', () => {
            const result: UserNotificationDto = fromEntity(serviceSlot, user);
            expect(result).toBeDefined();
            expect(result.id).toEqual(serviceSlot.uuid);
            expect(result.recipientId).toEqual(user.id);
            expect(result.referenceType).toEqual('ServiceSlot');
        });
    });
});
