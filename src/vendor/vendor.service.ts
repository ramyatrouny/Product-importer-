import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Vendor } from './schemas/vendor.schema';

/**
 * VendorService provides methods to find or create vendors in the database.
 */
@Injectable()
export class VendorService {
  private readonly logger = new Logger(VendorService.name);

  constructor(@InjectModel(Vendor.name) private vendorModel: Model<Vendor>) {}

  /**
   * Finds an existing vendor by external ID or creates a new one if it doesn't exist.
   * @param data - The vendor data.
   * @returns The MongoDB document ID of the vendor.
   */
  async findOrCreateVendor(data: any): Promise<string> {
    try {
      const { VendorID, VendorName, OtherField } = data;

      // Use findOneAndUpdate to combine find and update operations
      const vendor = await this.vendorModel
        .findOneAndUpdate(
          { externalId: VendorID },
          {
            $set: {
              name: VendorName,
              otherField: OtherField,
            },
          },
          {
            new: true, // Return the updated document
            upsert: true, // Create the document if it does not exist
            setDefaultsOnInsert: true, // Apply default values if new document is created
          },
        )
        .exec();

      if (!vendor) {
        throw new BadRequestException('Failed to find or create vendor');
      }

      this.logger.log(`Vendor ${vendor.externalId} processed`);

      return vendor._id.toString();
    } catch (error) {
      this.logger.error(`Error in findOrCreateVendor: ${error.message}`);
      throw new BadRequestException('Failed to find or create vendor');
    }
  }
}
