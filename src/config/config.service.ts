import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { createDbConfig } from './database.config';

import * as dotenv from 'dotenv';

@Injectable()
export class ConfigService {
  constructor() {
    dotenv.config();
  }

  static getDateFormat(): string {
    return 'YYYY-MM-DD';
  }

  static getTimeDateFormat(): string {
    return 'YYYY-MM-DD HH:mm';
  }

  static getMonthFormat(): string {
    return 'YYYY-MM';
  }

  getRateAPIInfo(): {
    url: string;
    ratesUri: string;
    apiKey: string;
    dateFormat: string;
  } {
    return {
      url: process.env.RATE_API_URL,
      ratesUri: process.env.RATE_API_RATES_URI,
      dateFormat: process.env.RATE_API_DATE_FORMAT,
      apiKey: process.env.RATE_API_KEY
    };
  }

  getServerPort(): number {
    return +process.env.SERVER_PORT;
  }

  getJWTSecret(): string {
    return process.env.JWT_SECRET;
  }

  getSaltRounds(): number {
    return +process.env.SALT_ROUNDS || 10;
  }

  getDatabaseConfig(): TypeOrmModuleOptions {
    return createDbConfig();
  }
}
