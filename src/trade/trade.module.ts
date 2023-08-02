
import { Module } from '@nestjs/common';
import { TradeController } from './trade.controller';
import { DiabloItemModule } from 'src/diabloItems/diablo-item.module';
import { DiabloItemService } from 'src/diabloItems/diablo-item.service';

@Module({
  imports: [DiabloItemModule],
  controllers: [TradeController]
})
export class TradeModule {}