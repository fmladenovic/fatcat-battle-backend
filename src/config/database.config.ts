import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from '../db/naming-strategies/snake-case.naming';

export const createDbConfig = (): TypeOrmModuleOptions => ({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: +process.env.DB_PORT || 3306,
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_SCHEMA_NAME,
  namingStrategy: new SnakeNamingStrategy(),
  logging: process.env.DB_LOG === 'true',
  synchronize: false,
  migrationsRun: false,
  entities: ['dist/**/*.entity{ .ts,.js}'],
  migrations: ['dist/db/migrations/*{.ts,.js}'],
  migrationsTableName: 'migrations',
  cli: {
    migrationsDir: 'src/db/migrations/',
  },
});

export const createSeedConfig = (): TypeOrmModuleOptions => ({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: +process.env.DB_PORT || 3306,
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_SCHEMA_NAME,
  namingStrategy: new SnakeNamingStrategy(),
  logging: process.env.DB_LOG === 'true',
  synchronize: false,
  migrationsRun: false,
  entities: ['dist/**/*.entity{ .ts,.js}'],
  migrations: ['dist/db/seeds/*{.ts,.js}'],
  migrationsTableName: 'seeds',
  cli: {
    migrationsDir: 'src/db/seeds/',
  },
});
