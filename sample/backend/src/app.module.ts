import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {MedicalEntity} from "./entities/medical.entity";
import {getConnectionOptions} from "typeorm";
import { FinancialModule } from './financial/financial.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async () =>
        Object.assign(await getConnectionOptions(), {
          autoLoadEntities: true,
        }),
    }),
    TypeOrmModule.forFeature([MedicalEntity]),
    FinancialModule
  ],

  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
