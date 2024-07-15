import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { ProductService } from './product.service';
import { ProductSchema, Product } from './schemas/product.schema';
import { VendorSchema, Vendor } from '../vendor/schemas/vendor.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    MongooseModule.forFeature([{ name: Vendor.name, schema: VendorSchema }]),
    ScheduleModule.forRoot(),
  ],
  providers: [ProductService],
})
export class ProductModule {}
