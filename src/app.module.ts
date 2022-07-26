import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UserAuth } from './auth/entities/user-auth.entity';
import { UserToken } from './auth/entities/user-token.entity';
import { PlaceModule } from './place/place.module';
import { FourSquareModule } from './providers/apis/foursquare_api/foursquare.module';
import { Transaction } from './transaction/entities/transaction.entity';
import { User } from './user/entities/user.entity';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: +configService.get<number>('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [User, UserAuth, UserToken, Transaction],
        synchronize: false,
      }),
    }),
    UserModule,
    AuthModule,
    PlaceModule,
    FourSquareModule,
  ],
})
export class AppModule {}
