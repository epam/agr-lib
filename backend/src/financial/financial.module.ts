import {Module} from '@nestjs/common';
import {FinancialController} from "./financial.controller";
import {FinancialService} from "./financial.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {AccountTypesEntity} from "../entities/account-types.entity";
import {AccountsEntity} from "../entities/accounts.entity";
import {FinancialUsersEntity} from "../entities/financial-users.entity";
import {TransactionTypesEntity} from "../entities/transaction-types.entity";
import {TransactionsEntity} from "../entities/transactions.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([AccountTypesEntity, AccountsEntity, FinancialUsersEntity, TransactionTypesEntity, TransactionsEntity]),
  ],
  exports:[
    TypeOrmModule
  ],
  controllers: [FinancialController],
  providers: [FinancialService],
})
export class FinancialModule {

}
