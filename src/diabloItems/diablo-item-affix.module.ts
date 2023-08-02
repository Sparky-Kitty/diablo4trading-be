// database.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiabloItemAffix } from './diablo-item-affix.entity';
import { DiabloItemAffixService } from './diablo-item-affix.service';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            useFactory: async () => ({
                name: 'memory',
                type: 'sqlite',
                database: ':memory:',
                entities: [DiabloItemAffix],
                synchronize: true
            })
        }),
        TypeOrmModule.forFeature([DiabloItemAffix])
    ],
    providers: [DiabloItemAffixService]
})
export class DiabloItemAffixModule {
    constructor() { }
}
