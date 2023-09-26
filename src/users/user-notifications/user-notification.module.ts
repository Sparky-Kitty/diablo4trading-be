import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserVouch } from 'src/users/user-vouch/user-vouch.entity';
import { UserVouchCalculation } from 'src/users/user-vouch/user-vouch-calculation.entity';
import { ItemListing } from 'src/item-listings/item-listing.entity';
import { UserVouchService } from 'src/users/user-vouch/user-vouch.service';
import { Service } from '../../services/services.entity';
import { ServiceSlot } from '../../services/service-slots/service-slots.entity';
import { UserNotificationController } from './user-notification.controller';
import { UserNotificationService } from './user-notification.service';
import { User } from '../users.entity';
import { UsersService } from '../users.service';

@Module({
    imports: [TypeOrmModule.forFeature([Service, ServiceSlot, User, UserVouch, UserVouchCalculation, ItemListing])],
    providers: [UserNotificationService, UserVouchService, UsersService],
    controllers: [UserNotificationController],
})
export class UserNotificationModule {}
