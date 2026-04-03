import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        type: 'mssql',
        host: config.get('DATABASE_HOST'),
        port: parseInt(config.get<string>('DATABASE_PORT') ?? '1433'),
        database: config.get('DATABASE_NAME'),
        options: {
          encrypt: false,
          trustServerCertificate: true,
        },
        extra: {
          trustedConnection: true,
        },
        synchronize: false,
        autoLoadEntities: true,
      }),
      inject: [ConfigService],
    }),
  ],
})
export class AppModule {}
