import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Vendor extends Document {
  @Prop()
  name: string;

  @Prop()
  externalId: string;

  @Prop()
  otherField: string;
}

export const VendorSchema = SchemaFactory.createForClass(Vendor);
