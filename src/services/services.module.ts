// services.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServicesController } from './services.controller';
import { Service } from './services.entity';
import { ServicesService } from './services.service';

@Module({
    imports: [TypeOrmModule.forFeature([Service])], // Import TypeOrmModule to interact with your database
    providers: [ServicesService],
    controllers: [ServicesController],
})
export class ServicesModule {}
