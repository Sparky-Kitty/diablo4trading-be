
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiabloItem } from 'src/diabloItems/diablo-item.entity';
import { DiabloItemAffix } from 'src/diabloItems/diablo-item-affix.entity';
import { TradeController } from './trade.controller';

@Module({
  imports: [TypeOrmModule.forFeature([DiabloItem, DiabloItemAffix])],
  controllers: [TradeController],
})
export class TradeModule {}