import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VendorModule } from './vendor/vendor.module';
import { ProductModule } from './product/product.module';
import { ProductScheduler } from './product/product.scheduler';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGODB_URI),
    ScheduleModule.forRoot(),
    VendorModule,
    ProductModule,
  ],
  controllers: [AppController],
  providers: [AppService, ProductScheduler],
})
export class AppModule {}
