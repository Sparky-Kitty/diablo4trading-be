import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    HttpException,
    HttpStatus,
    NotFoundException,
    Param,
    Post,
    Put,
    Query,
} from '@nestjs/common';
import { OptionalParseIntPipe } from '../pipes/optional-parse-int-pipe';
import { Service } from './services.entity';
import { SERVICE_ERROR_CODES, ServicesService } from './services.service';

const MAX_SERVICE_COUNT = 3;

@Controller('services')
export class ServicesController {
    constructor(private readonly servicesService: ServicesService) {
    }

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
            .searchByTags(tags)
            .filterByAvailableSlots(availableSlots)
            .paginate(offset, limit)
            .orderBy('bumpedAt', 'DESC')
            .getMany();
    }

    @Post('')
    async create(@Body() dto: Partial<Service>): Promise<Service> {
        const notDeletedServicesCount = await this.servicesService.countNotDeletedServices();

        if (notDeletedServicesCount >= MAX_SERVICE_COUNT) {
            throw new BadRequestException(`Cannot create more than ${MAX_SERVICE_COUNT} non-deleted records`);
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

        const updatedMaxSlots = typeof updateDto.maxSlots === 'number' ? updateDto.maxSlots : existingService.maxSlots;

        const updatedAvailableSlots = typeof updateDto.availableSlots === 'number'
            ? updateDto.availableSlots
            : existingService.availableSlots;

        if (updatedAvailableSlots > updatedMaxSlots) {
            throw new BadRequestException('Available slots cannot exceed the max slots.');
        }

        if (updatedMaxSlots < updatedAvailableSlots) {
            throw new BadRequestException('Max slots cannot be less than the available slots.');
        }

        try {
            return await this.servicesService.updateService(id, updateDto);
        } catch (error) {
            throw new HttpException(
                error?.message || 'Unknown error',
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
            if (error?.code === SERVICE_ERROR_CODES.BUMP_TOO_SOON) {
                throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
            } else if (error?.code === SERVICE_ERROR_CODES.SERVICE_NOT_FOUND) {
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
