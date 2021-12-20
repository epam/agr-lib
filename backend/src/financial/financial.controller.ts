import {Body, Controller, Get, Param, Patch} from '@nestjs/common';
import {FinancialService} from "./financial.service";
import {UpdateAccountDto} from "./dto/create-account.dto";
import {UpdateUserDto} from "./dto/create-user.dto";
import {UpdateTransactionDto} from "./dto/create-transaction.dto";

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
  patchAccount(@Param('id') id: string, @Body() body: UpdateAccountDto) {
    return this.financialService.updateAccount(id, body);
  }

  @Patch('user/:id')
  patchUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.financialService.updateUser(id, body);
  }

  @Patch('transaction/:id')
  patchTransaction(@Param('id') id: string, @Body() body: UpdateTransactionDto) {
    return this.financialService.updateTransaction(id, body);
  }
}
