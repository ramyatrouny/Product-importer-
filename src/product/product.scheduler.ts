import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { ProductService } from './product.service';

/**
 * ProductScheduler class handles the scheduling of product imports.
 * This class runs a cron job to import products from a CSV file every day at midnight.
 */
@Injectable()
export class ProductScheduler {
  private readonly logger = new Logger(ProductScheduler.name);

  constructor(private readonly productService: ProductService) {}

  /**
   * Cron job that runs every day at midnight to import products from a CSV file.
   */
  @Cron('0 0 * * *')
  async handleCron() {
    try {
      this.logger.log('Starting scheduled product import...');
      const filePath = process.env.CSV_FILE_PATH;
      await this.productService.importProducts(filePath);
      this.logger.log('Scheduled product import completed successfully.');
    } catch (error) {
      this.logger.error('Scheduled product import failed.', error);
      // Optionally: Add additional error handling or notifications here
    }
  }
}
