import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {MedicalEntity} from "./entities/medical.entity";
import {getConnectionOptions} from "typeorm";

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async () =>
        Object.assign(await getConnectionOptions(), {
          autoLoadEntities: true,
        }),
    }),
    TypeOrmModule.forFeature([MedicalEntity])
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
