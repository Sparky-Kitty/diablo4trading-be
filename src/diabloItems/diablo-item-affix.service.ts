import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DiabloItemAffix } from './diablo-item-affix.entity';
import { Assets } from '@diablosnaps/assets';

@Injectable()
export class DiabloItemAffixService implements OnModuleInit {
    constructor(
        @InjectRepository(DiabloItemAffix)
        private readonly diabloItemAffixRepository: Repository<DiabloItemAffix>,
    ) { }

    async onModuleInit() {
        await this.populateDatabase();
    }

    async populateDatabase() {
        // Read the affix.json file
        const affixData = (await Assets.loadAffixes()).definitions;

        // Get the repository for DiabloItemAffix entity
        const diabloItemAffixRepository = this.diabloItemAffixRepository;
        for (const id in affixData.basic) {
            const { name } = affixData.basic[id];
            const affix = new DiabloItemAffix();
            affix.id = parseInt(id);
            affix.name = name;
            await diabloItemAffixRepository.save(affix);
        }
    }
}