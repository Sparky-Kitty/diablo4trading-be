import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { API } from '@sanctuaryteam/shared';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { ServiceSlot } from 'src/services/service-slots/service-slots.entity';
import { Service } from 'src/services/services.entity';
import { Repository } from 'typeorm';
import { UserVouch } from '../user-vouch/user-vouch.entity';
import { User } from '../users.entity';
// import { UsersService } from '../users.service';
import { fromEntity as userNotificationFromEntity, UserNotificationDto } from './user-notification.dto';
import { UserNotificationService } from './user-notification.service';
import { RequestModel } from 'src/auth/request.model';

@UseGuards(JwtAuthGuard)
@Controller('users/notifications')
export class UserNotificationController {
    constructor(
        @InjectRepository(Service) public readonly serviceRepository: Repository<Service>,
        @InjectRepository(ServiceSlot) public readonly serviceSlotRepository: Repository<ServiceSlot>,
        @InjectRepository(UserVouch) public readonly userVouchRepository: Repository<UserVouch>,
        @InjectRepository(User) public readonly userRepository: Repository<User>,
        private readonly userNotificationService: UserNotificationService,
        // private readonly usersService: UsersService,
    ) {}

    @Get('/')
    async search(@Request() req: RequestModel): Promise<UserNotificationDto[]> {
        const { uuid } = req.user;
        // const recipient = uuid && await this.usersService.findByUuId(uuid);

        const serviceSlotsPromise: Promise<UserNotificationDto[]> = this.userNotificationService
            .createQuery()
            .getSlotsByUserUuid(this.serviceSlotRepository, uuid)
            .then(slots =>
                slots.map(slot =>
                    userNotificationFromEntity(slot, req.user, {
                        hideDiscriminator: slot.state === API.ServiceSlotStates.Pending,
                    })
                )
            );

        const userVouchesPromise: Promise<UserNotificationDto[]> = this.userNotificationService
            .createQuery()
            .getVouchesByUserUuid(this.userVouchRepository, this.serviceRepository, uuid)
            .then(userVouches =>
                userVouches.map(vouch => userNotificationFromEntity(vouch, req.user, { hideDiscriminator: false }))
            );

        const [serviceSlots, userVouches] = await Promise.all([serviceSlotsPromise, userVouchesPromise]);

        const combinedResults = [...serviceSlots, ...userVouches];

        return combinedResults;
    }
}
