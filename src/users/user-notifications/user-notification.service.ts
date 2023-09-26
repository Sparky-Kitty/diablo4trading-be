import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { ItemListingBid } from 'src/item-listings/item-listing-bids/item-listing-bid.entity';
import { ServiceSlot } from 'src/services/service-slots/service-slots.entity';
import { UserVouch } from '../user-vouch/user-vouch.entity';
import { User } from '../users.entity';
import { ItemListing } from 'src/item-listings/item-listing.entity';
import { Service } from 'src/services/services.entity';

@Injectable()
export class UserNotificationService {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        @InjectRepository(Service) public readonly serviceRepository: Repository<Service>,
        @InjectRepository(ItemListing) public readonly itemListingRepository: Repository<ItemListing>,
    ) {
    }

    createQuery() {
        return new CustomQueryBuilder(
            this.userRepository.createQueryBuilder('user'),
        );
    }
}

class CustomQueryBuilder<T> {
    private readonly serviceRepository: Repository<Service>;
    private readonly itemListingRepository: Repository<ItemListing>;
    private queryBuilder: SelectQueryBuilder<T>;

    // Pass the repository as a parameter to the constructor
    constructor(queryBuilder: SelectQueryBuilder<T>, private repository?: Repository<T>) {
        this.queryBuilder = queryBuilder;
    }
    
    async findItemListingById(itemListingRepository: Repository<ItemListing>, id: number): Promise<ItemListing | undefined> {
      return itemListingRepository.findOne({ where: { id } });
    }
  
    async findServiceById(serviceRepository: Repository<Service>, id: number): Promise<Service | undefined> {
      return serviceRepository.findOne({ where: { id } });
    }

    async getMany(): Promise<T[]> {
        return await this.queryBuilder.getMany();
    }

    // Usage example for slots
    async getSlotsByUserUuid(serviceSlotRepository: Repository<ServiceSlot>, userUuid?: string) {
        const serviceSlotQueryBuilder = serviceSlotRepository.createQueryBuilder('service_slot')
            .leftJoinAndSelect('service_slot.client', 'client')
            .leftJoinAndSelect('service_slot.serviceOwner', 'serviceOwner')
            .leftJoinAndSelect('service_slot.service', 'service')
            .where('client.uuid = :userUuid OR serviceOwner.uuid = :userUuid', { userUuid });
    
        const customQueryBuilder = new CustomQueryBuilder<ServiceSlot>(serviceSlotQueryBuilder, serviceSlotRepository);
    
        return await customQueryBuilder.getMany();
    }

    // Usage example for vouches
    // async getVouchesByUserUuid(userVouchRepository: Repository<UserVouch>, userUuid?: string) {
    //     const userVouchQueryBuilder = userVouchRepository.createQueryBuilder('user_vouch')
    //         .leftJoinAndSelect('user_vouch.author', 'author')
    //         .leftJoinAndSelect('user_vouch.recipient', 'recipient')
    //         .leftJoinAndSelect('user_vouch.reference', 'reference')
    //         .where('author.uuid = :userUuid OR recipient.uuid = :userUuid', { userUuid })
    //         .andWhere('(user_vouch.referenceType = :itemListingType AND reference.id = user_vouch.referenceId) OR (user_vouch.referenceType = :serviceType AND reference.id = user_vouch.referenceId)', { itemListingType: 'ItemListing', serviceType: 'Service' });
    //     const customQueryBuilder = new CustomQueryBuilder<UserVouch>(userVouchQueryBuilder, userVouchRepository);
    
    //     return await customQueryBuilder.getMany();
    // }
    async getVouchesByUserUuid(userVouchRepository: Repository<UserVouch>, userUuid?: string) {
        // Fetch UserVouch records
        const userVouches = await userVouchRepository.createQueryBuilder('user_vouch')
            .leftJoinAndSelect('user_vouch.author', 'author')
            .leftJoinAndSelect('user_vouch.recipient', 'recipient')
            .where('author.uuid = :userUuid OR recipient.uuid = :userUuid', { userUuid })
            .getMany();
    
        // Load reference data based on referenceType
        for (const vouch of userVouches) {
            if (vouch.referenceType === 'ItemListing') {
                vouch.reference = await this.findItemListingById(this.itemListingRepository, vouch.referenceId)
            } else if (vouch.referenceType === 'Service') {
                vouch.reference = await this.findServiceById(this.serviceRepository, vouch.referenceId)
                // vouch.reference = await this.serviceRepository.createQueryBuilder('service')
                //     .where('service.id = :id', { id: vouch.referenceId })
                //     .getOne();
            }
        }
    
        return userVouches;
    }
    
    // Usage example for bids
    async getBidsByUserUuid(itemListingBidRepository: Repository<ItemListingBid>, userUuid?: string) {
        const itemListingBidQueryBuilder = itemListingBidRepository.createQueryBuilder('item_listing_bid')
            .leftJoinAndSelect('item_listing_bid.user', 'bid_user')
            .where('bid_user.uuid = :userUuid', { userUuid });
    
        const customQueryBuilder = new CustomQueryBuilder<ItemListingBid>(itemListingBidQueryBuilder, itemListingBidRepository);
    
        return await customQueryBuilder.getMany();
    }
}
