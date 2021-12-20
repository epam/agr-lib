import {Body, Controller, Get, Param, Patch} from '@nestjs/common';
import {FinancialService} from "./financial.service";
import {UpdateAccountDto} from "./dto/create-account.dto";

@Controller('/api/financial')
export class FinancialController {
  constructor(private financialService: FinancialService) {
  }

  @Get('account-types')
  getAccountTypes() {
    return this.financialService.getAccountTypes();
  }

  @Get('accounts')
  getAccounts() {
    return this.financialService.getAccounts();
  }

  @Get('financial-users')
  getFinancialUsers() {
    return this.financialService.getFinancialUsers();
  }

  @Get('transaction-types')
  getTransactionTypes() {
    return this.financialService.getTransactionsType();
  }

  @Get('transactions')
  getTransactions() {
    return this.financialService.getTransactions();
  }

  @Patch('account/:id')
  putSimpleTable(@Param('id') id:string, @Body() body:UpdateAccountDto) {
    return this.financialService.updateAccount(id,body);
  }
}
