import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database.module';
import { DiabloItemModule } from './diablo-items/diablo-item.module';
import { ItemListingsModule } from './item-listings/item-listings.module';
import { ServiceSlotsModule } from './services/service-slots/service-slots.module';
import { ServicesModule } from './services/services.module';
import { LoggingMiddleware } from './middleware/request-logging.middleware';

@Module({
    imports: [
        DatabaseModule,
        ScheduleModule.forRoot(),
        AuthModule,
        DiabloItemModule,
        ItemListingsModule,
        ServicesModule,
        ServiceSlotsModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(LoggingMiddleware).forRoutes('*');  // Apply for all routes
    }
}
