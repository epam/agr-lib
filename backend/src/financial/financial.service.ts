import {Injectable} from '@nestjs/common';
import {EntityManager, Repository} from "typeorm";
import {AccountTypesEntity} from "../entities/account-types.entity";
import {TransactionTypesEntity} from "../entities/transaction-types.entity";
import {AccountsEntity} from "../entities/accounts.entity";
import {FinancialUsersEntity} from "../entities/financial-users.entity";
import {TransactionsEntity} from "../entities/transactions.entity";
import {UpdateAccountDto} from "./dto/create-account.dto";
import {InjectRepository} from "@nestjs/typeorm";

@Injectable()
export class FinancialService {
  constructor(private entityManager: EntityManager,
              @InjectRepository(AccountsEntity) private accountRepository: Repository<AccountsEntity>) {
  }

  getAccountTypes(): Promise<AccountTypesEntity[]> {
    return this.entityManager.find<AccountTypesEntity>(AccountTypesEntity)
  }

  getAccounts(): Promise<AccountsEntity[]> {
    return this.entityManager.find<AccountsEntity>(AccountsEntity)
  }

  getFinancialUsers(): Promise<FinancialUsersEntity[]> {
    return this.entityManager.find<FinancialUsersEntity>(FinancialUsersEntity);
  }

  getTransactionsType(): Promise<TransactionTypesEntity[]> {
    return this.entityManager.find<TransactionTypesEntity>(TransactionTypesEntity);
  }

  getTransactions(): Promise<TransactionsEntity[]> {
    return this.entityManager.find<TransactionsEntity>(TransactionsEntity);
  }

  updateAccount(id: string, update: UpdateAccountDto) {
    return this.accountRepository.update(id, update);
  }
}
