import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { DiabloItemModule } from './diabloItems/diablo-item.module';
import { TradeModule } from './trade/trade.module';
import { DatabaseModule } from './database.module';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    DiabloItemModule,
    TradeModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
