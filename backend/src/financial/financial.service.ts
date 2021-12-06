import {Injectable} from '@nestjs/common';
import {EntityManager} from "typeorm";
import {AccountTypesEntity} from "../entities/account-types.entity";
import {TransactionTypesEntity} from "../entities/transaction-types.entity";
import {AccountsEntity} from "../entities/accounts.entity";
import {FinancialUsersEntity} from "../entities/financial-users.entity";
import {TransactionsEntity} from "../entities/transactions.entity";

@Injectable()
export class FinancialService {
  constructor(private entityManager: EntityManager) {
  }

  getAccountTypes():Promise<AccountTypesEntity[]>{
    return this.entityManager.find<AccountTypesEntity>(AccountTypesEntity)
  }

  getAccounts():Promise<AccountsEntity[]>{
    return this.entityManager.find<AccountsEntity>(AccountsEntity)
  }

  getFinancialUsers():Promise<FinancialUsersEntity[]>{
    return this.entityManager.find<FinancialUsersEntity>(FinancialUsersEntity);
  }

  getTransactionsType():Promise<TransactionTypesEntity[]>{
    return this.entityManager.find<TransactionTypesEntity>(TransactionTypesEntity);
  }

  getTransactions():Promise<TransactionsEntity[]>{
    return this.entityManager.find<TransactionsEntity>(TransactionsEntity);
  }

}
