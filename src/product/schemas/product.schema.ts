import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { nanoid } from 'nanoid';

@Schema()
export class Product extends Document {
  @Prop()
  productId: string;

  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop()
  packaging: string;

  @Prop()
  vendorId: string;

  @Prop()
  manufacturerId: string;

  @Prop({ default: () => nanoid() })
  docId: string;

  @Prop({ type: [{ id: String }] })
  options: Array<{ id: string }>;

  @Prop({ default: false })
  deleted: boolean;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
