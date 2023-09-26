import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceSlotsController } from './service-slots.controller';
import { ServiceSlotsCronService } from './service-slots.cron';
import { ServiceSlot } from './service-slots.entity';
import { ServiceSlotsService } from './service-slots.service';
import { UserVouch } from 'src/users/user-vouch/user-vouch.entity';
import { UserVouchCalculation } from 'src/users/user-vouch/user-vouch-calculation.entity';
import { ItemListing } from 'src/item-listings/item-listing.entity';
import { UserVouchService } from 'src/users/user-vouch/user-vouch.service';
import { Service } from '../services.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Service, ServiceSlot, UserVouch, UserVouchCalculation, ItemListing])],
    providers: [ServiceSlotsService, ServiceSlotsCronService, UserVouchService],
    controllers: [ServiceSlotsController],
})
export class ServiceSlotsModule {}
