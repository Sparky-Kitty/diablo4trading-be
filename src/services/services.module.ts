// services.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServicesService } from './services.service';
import { ServicesController } from './services.controller';
import { Service } from './services.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Service])], // Import TypeOrmModule to interact with your database
  providers: [ServicesService],
  controllers: [ServicesController],
})
export class ServicesModule {}
