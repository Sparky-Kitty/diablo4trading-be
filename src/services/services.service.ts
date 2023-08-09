import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Service } from './services.entity';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,
  ) {}

  createQuery() {
    return new CustomQueryBuilder(
      this.serviceRepository.createQueryBuilder('service'),
    );
  }

  async findById(id: number): Promise<Service> {
    return this.serviceRepository.findOneBy({ id });
  }

  async countNotDeletedServices(): Promise<number> {
    return await this.serviceRepository.count({ where: { deleted: false } });
  }

  async createService(data: Partial<Service>): Promise<Service> {
    const service = this.serviceRepository.create(data);
    return await this.serviceRepository.save(service);
  }

  async updateService(id: number, dto: Partial<Service>): Promise<Service> {
    const existingService = await this.serviceRepository.findOneBy({ id });
    if (!existingService) {
      throw new Error(`Service with ID ${id} not found`);
    }

    await this.serviceRepository.update(id, dto);
    return await this.serviceRepository.findOneBy({ id });
  }

  async deleteService(id: number): Promise<void> {
    await this.serviceRepository.delete(id);
  }

  async softDeleteService(id: number): Promise<void> {
    await this.serviceRepository.update(id, { deleted: true });
  }

  async undoSoftDeleteService(id: number): Promise<void> {
    await this.serviceRepository.update(id, { deleted: false });
  }

  async bumpService(id: number): Promise<void> {
    const service = await this.serviceRepository.findOne({ where: { id } });
    if (!service) {
      throw new Error('Service not found');
    }

    const halfHourAgo = new Date(Date.now() - 30 * 60 * 1000);
    if (service.bumped_at > halfHourAgo) {
      throw new Error('Service was bumped less than 30 minutes ago');
    }

    await this.serviceRepository.update(id, { bumped_at: new Date() });
  }
}

class CustomQueryBuilder {
  private queryBuilder: SelectQueryBuilder<Service>;

  constructor(queryBuilder: SelectQueryBuilder<Service>) {
    this.queryBuilder = queryBuilder;
  }

  searchByTitle(title: string): CustomQueryBuilder {
    if (title) {
      this.queryBuilder = this.queryBuilder.andWhere(
        'service.title LIKE :title',
        { title: `%${title}%` },
      );
    }
    return this;
  }

  searchByTags(tags?: number[]): CustomQueryBuilder {
    if (tags && tags.length > 0) {
      for (const tag of tags) {
        this.queryBuilder = this.queryBuilder.orWhere(
          `(service.tags & :tag) = :tag`,
          { tag },
        );
      }
    }
    return this;
  }

  filterByAvailableSlots(minSlots?: number): CustomQueryBuilder {
    if (typeof minSlots === 'number') {
      this.queryBuilder = this.queryBuilder.andWhere(
        'service.available_slots >= :minSlots',
        { minSlots },
      );
    }

    return this;
  }

  paginate(offset?: number, limit?: number): CustomQueryBuilder {
    if (typeof offset === 'number') {
      this.queryBuilder = this.queryBuilder.skip(offset);
    }
    if (typeof limit === 'number') {
      this.queryBuilder = this.queryBuilder.take(limit);
    }
    return this;
  }

  orderBy(
    field: keyof Service,
    order: 'ASC' | 'DESC' = 'DESC',
  ): CustomQueryBuilder {
    this.queryBuilder = this.queryBuilder.orderBy(`service.${field}`, order);
    return this;
  }

  getMany(): Promise<Service[]> {
    return this.queryBuilder.getMany();
  }
}
