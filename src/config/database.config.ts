import { DataSourceOptions } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config as dotenvConfig } from 'dotenv';

export const typeOrmConfig = (configService?: ConfigService): DataSourceOptions => {
  let typeOrmOptions: DataSourceOptions;

  if (!configService) {
    dotenvConfig();
    configService = {
      get: (property: string) => process.env[property]
    } as ConfigService;
  }

  const databaseType = configService.get<string>('DATABASE_TYPE');
  const isDevelopment = configService.get<string>('NODE_ENV') === 'development';

 

  if (isDevelopment && databaseType === 'sqlite') {
    typeOrmOptions = {
      type: 'sqlite',
      database: configService.get<string>('DATABASE_FILE'),
      entities: [__dirname + '/../**/*.entity.{js,ts}'],
      synchronize: false,
      migrations: [__dirname + '/../../migrations/*.{js,ts}']
    };
  } else if (!isDevelopment && databaseType === 'mysql') {
    typeOrmOptions = {
      type: 'mysql',
      host: configService.get<string>('DATABASE_HOST'),
      port: configService.get<number>('DATABASE_PORT'),
      username: configService.get<string>('DATABASE_USERNAME'),
      password: configService.get<string>('DATABASE_PASSWORD'),
      database: configService.get<string>('DATABASE_NAME'),
      entities: [__dirname + '/../**/*.entity.{js,ts}'],
      synchronize: false,
      migrations: [__dirname + '/../../migrations/*.{js,ts}']
    };
  } else {
    throw new Error('Invalid DATABASE_TYPE or NODE_ENV configuration.');
  }

  return typeOrmOptions;
};