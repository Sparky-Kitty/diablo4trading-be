import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  HttpException,
  HttpStatus,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Service } from './services.entity';
import { ServicesService } from './services.service';
import { OptionalParseIntPipe } from '../pipes/optional-parse-int-pipe';

@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Get('')
  async search(
    @Query('title') title?: string,
    @Query('tags', OptionalParseIntPipe) tags?: number,
    @Query('offset', OptionalParseIntPipe) offset?: number,
    @Query('limit', OptionalParseIntPipe) limit?: number,
    @Query('availableSlots', OptionalParseIntPipe) availableSlots?: number,
  ): Promise<Service[]> {
    return await this.servicesService
      .createQuery()
      .searchByTitle(title)
      .searchByTags(typeof tags === 'number' ? [tags] : [])
      .filterByAvailableSlots(availableSlots)
      .paginate(offset, limit)
      .orderBy('bumped_at', 'DESC')
      .getMany();
  }

  @Post('')
  async create(@Body() dto: Partial<Service>): Promise<Service> {
    const notDeletedServicesCount =
      await this.servicesService.countNotDeletedServices();

    if (notDeletedServicesCount >= 3) {
      throw new HttpException(
        'Cannot create more than 3 non-deleted records',
        HttpStatus.FORBIDDEN,
      );
    }

    return await this.servicesService.createService(dto);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateDto: Partial<Service>,
  ): Promise<Service> {
    const existingService = await this.servicesService.findById(id);

    if (!existingService) {
      throw new NotFoundException(`Service with ID ${id} not found`);
    }

    const updatedMaxSlots =
      typeof updateDto.max_slots === 'number'
        ? updateDto.max_slots
        : existingService.max_slots;

    const updatedAvailableSlots =
      typeof updateDto.available_slots === 'number'
        ? updateDto.available_slots
        : existingService.available_slots;

    if (updatedAvailableSlots > updatedMaxSlots) {
      throw new BadRequestException(
        'Available slots cannot exceed the max slots.',
      );
    }

    if (updatedMaxSlots < updatedAvailableSlots) {
      throw new BadRequestException(
        'Max slots cannot be less than the available slots.',
      );
    }

    try {
      return await this.servicesService.updateService(id, updateDto);
    } catch (error) {
      throw new HttpException(
        'Unknown error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete(':id/delete')
  async delete(@Param('id') id: number): Promise<void> {
    await this.servicesService.deleteService(id);
  }

  @Delete(':id/soft-delete')
  async softDelete(@Param('id') id: number): Promise<void> {
    await this.servicesService.softDeleteService(id);
  }

  @Put(':id/undo-soft-delete')
  async undoSoftDelete(@Param('id') id: number): Promise<void> {
    await this.servicesService.undoSoftDeleteService(id);
  }

  @Post(':id/bump')
  async bumpService(@Param('id') id: number): Promise<void> {
    try {
      await this.servicesService.bumpService(id);
    } catch (error) {
      if (error.message.includes('30 minutes ago')) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      } else if (error.message.includes('Service not found')) {
        throw new HttpException(error.message, HttpStatus.NOT_FOUND);
      } else {
        throw new HttpException(
          'Unknown error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
}
