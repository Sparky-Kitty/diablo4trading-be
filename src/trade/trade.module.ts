import { Module } from '@nestjs/common';
import { DiabloItemModule } from 'src/diabloItems/diablo-item.module';
import { DiabloItemService } from 'src/diabloItems/diablo-item.service';
import { TradeController } from './trade.controller';

@Module({
    imports: [DiabloItemModule],
    controllers: [TradeController],
})
export class TradeModule {}
