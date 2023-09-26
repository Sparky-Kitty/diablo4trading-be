import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { API } from '@sanctuaryteam/shared';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { SkipGuards } from 'src/auth/skip-guards.decorator';
import { ServiceSlot } from 'src/services/service-slots/service-slots.entity';
import { Service } from 'src/services/services.entity';
import { Repository } from 'typeorm';
import { UserVouch } from '../user-vouch/user-vouch.entity';
import { User } from '../users.entity';
import { UsersService } from '../users.service';
import { fromEntity as userNotificationFromEntity, UserNotificationDto } from './user-notification.dto';
import { UserNotificationService } from './user-notification.service';

@UseGuards(JwtAuthGuard)
@Controller('users/notifications')
export class UserNotificationController {
    constructor(
        @InjectRepository(Service) public readonly serviceRepository: Repository<Service>,
        @InjectRepository(ServiceSlot) public readonly serviceSlotRepository: Repository<ServiceSlot>,
        @InjectRepository(UserVouch) public readonly userVouchRepository: Repository<UserVouch>,
        @InjectRepository(User) public readonly userRepository: Repository<User>,
        private readonly userNotificationService: UserNotificationService,
        private readonly usersService: UsersService,
    ) {}

    @SkipGuards()
    @Get('/')
    async search(
        @Query('recipientId') userUuid: string,
    ): Promise<UserNotificationDto[]> {
        console.log('here');
        const recipient = userUuid && await this.usersService.findByUuId(userUuid);

        if (!recipient) {
            // Handle the case where the user is not found
            return [];
        }

        const serviceSlotsPromise: Promise<UserNotificationDto[]> = this.userNotificationService
            .createQuery()
            .getSlotsByUserUuid(this.serviceSlotRepository, userUuid)
            .then(slots =>
                slots.map(slot =>
                    userNotificationFromEntity(slot, recipient, {
                        hideDiscriminator: slot.state === API.ServiceSlotStates.Pending,
                    })
                )
            );

        const userVouchesPromise: Promise<UserNotificationDto[]> = this.userNotificationService
            .createQuery()
            .getVouchesByUserUuid(this.userVouchRepository, this.serviceRepository, userUuid)
            .then(userVouches =>
                userVouches.map(vouch => userNotificationFromEntity(vouch, recipient, { hideDiscriminator: false }))
            );

        // Use Promise.all to wait for both promises to resolve
        const [serviceSlots, userVouches] = await Promise.all([serviceSlotsPromise, userVouchesPromise]);

        // Combine and return the results as needed
        const combinedResults = [...serviceSlots, ...userVouches];

        return combinedResults;
    }
}
