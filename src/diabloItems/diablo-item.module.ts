// database.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiabloItemAffix } from './diablo-item-affix.entity';
import { DiabloItemService } from './diablo-item.service';
import { DiabloItem } from './diablo-item.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([DiabloItemAffix], 'memory'),
        TypeOrmModule.forFeature([DiabloItem])
    ],
    exports: [DiabloItemService],
    providers: [DiabloItemService]
})
export class DiabloItemModule {
    constructor() { }
}
