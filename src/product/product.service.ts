import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as csv from 'csv-parser';
import * as fs from 'fs';
import { Product } from './schemas/product.schema';
import { VendorService } from '../vendor/vendor.service';
import { nanoid } from 'nanoid';
import axios from 'axios';

/**
 * ProductService class provides methods to import products from a CSV file,
 * enhance product descriptions, and interact with the MongoDB database.
 */
@Injectable()
export class ProductService {
  private readonly logger = new Logger(ProductService.name);

  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
    private readonly vendorService: VendorService,
  ) {}

  /**
   * Imports products from a CSV file, processes them, and saves them to the database.
   * @param filePath - The path to the CSV file containing product data.
   */
  async importProducts(filePath: string): Promise<void> {
    try {
      const products = [];
      const stream = fs.createReadStream(filePath).pipe(csv());

      for await (const data of stream) {
        const vendorId = await this.vendorService.findOrCreateVendor(data);

        const productId = data.ProductID;
        let product = products.find((p) => p.productId === productId);

        if (!product) {
          product = {
            productId: data.ProductID,
            name: data.ProductName,
            description: '',
            packaging: '',
            vendorId: vendorId,
            manufacturerId: nanoid(),
            options: [],
            deleted: false,
          };
          products.push(product);
        }

        product.options.push({ id: nanoid() });

        if (data.ItemDescription) {
          product.description = data.ItemDescription;
        }

        if (data.Packaging) {
          product.packaging = data.Packaging;
        }

        product.deleted = data.Deleted ? true : false;
      }

      this.logger.log('CSV file successfully processed');

      for (const product of products) {
        await this.productModel.updateOne(
          { productId: product.productId },
          product,
          { upsert: true },
        );
      }

      await this.enhanceDescriptions(); // Enhance product descriptions after importing
    } catch (error) {
      this.logger.error(`Failed to import products: ${error.message}`);
      throw new BadRequestException('Failed to import products');
    }
  }

  /**
   * Enhances the descriptions of products using GPT-4.
   */
  async enhanceDescriptions(): Promise<void> {
    try {
      const products = await this.productModel.find().limit(10).exec();

      for (const product of products) {
        const response = await axios.post(
          'https://api.openai.com/v1/engines/davinci-codex/completions',
          {
            prompt: `Enhance the description: ${product.description}`,
            max_tokens: 100,
          },
          {
            headers: {
              Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
              'Content-Type': 'application/json',
            },
          },
        );

        product.description = response.data.choices[0].text.trim();
        await product.save();
      }
    } catch (error) {
      this.logger.error(`Failed to enhance descriptions: ${error.message}`);
      throw new Error('Failed to enhance product descriptions');
    }
  }
}
