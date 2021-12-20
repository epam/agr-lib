import {Injectable} from '@angular/core';
import {AgrGridService} from "../shared/grid/agr-grid.service";
import {financialGridColumnDefs} from "./financial-grid-columns";
import {combineLatest} from "rxjs";
import {BusinessService} from "../business.service";
import {formatDate} from "@angular/common";
import {Column, ColumnHelper, Row} from "agr-lib";

@Injectable()
export class FinancialGridService extends AgrGridService<any> {
  private accounts;
  accountTypes;
  private financialUsers;
  transactionTypes;
  private transactions;

  constructor(private businessService: BusinessService) {
    super();
    this.gridEngine.setColumnDefs(financialGridColumnDefs());
  }

  refresh() {
    return combineLatest([
      this.businessService.getAccounts(),
      this.businessService.getAccountTypes(),
      this.businessService.getFinancialUsers(),
      this.businessService.getTransactionTypes(),
      this.businessService.getTransactions()
    ]).toPromise()
      .then(([accounts, accountTypes, financialUsers, transactionTypes,
               transaction]) => {
        this.accounts = accounts;
        this.accountTypes = accountTypes;
        this.financialUsers = financialUsers;
        this.transactionTypes = transactionTypes;
        this.transactions = transaction;
        // this.gridEngine.data = ;
        this.mapData();
      })
  }

  mapData() {
    const data = [];
    const hashAccountTypes = this.makeHash(this.accountTypes, 'id')
    const hashTransactionTypes = this.makeHash(this.transactionTypes, 'id')
    for (const user of this.financialUsers) {
      data.push(user);
      user.children = [];
      for (const account of this.accounts) {
        if (account.userId !== user.id) {
          continue;
        }
        account.children = [];
        account.accountType = hashAccountTypes[account.accountTypeId];
        user.children.push(account);
        for (const transaction of this.transactions) {
          if (transaction.accountId !== account.id) {
            continue;
          }
          account.children.push(transaction);
          transaction.transactionType = hashTransactionTypes[transaction.transactionTypeId]
        }


      }

    }
    console.log(data)
    this.gridEngine.data = data;
  }

  makeHash(list: any[], key: string) {
    const obj: any = {};
    list.forEach((item) => {
      obj[item[key]] = item;
    });
    return obj;
  }

  update(row: Row<any>, column: Column, update: any) {
    if (ColumnHelper.getColumnValue(row.data, column.columnDef) === update) {
      return;
    }
    let method: string;
    let updateInfo: any;
    switch (column.columnDef.field) {
      case 'accountType':
        updateInfo = {'accountTypeId': update.id};
        method = 'updateAccountTable'
        break;
      case 'transactionType':
        updateInfo = {'transactionTypeId': update.id};
        method = 'updateTransaction'
        break;
      default:
        updateInfo = {
          [column.columnDef.field]: update
        };
    }
    ColumnHelper.setColumnValue(row.data, column.columnDef, update);
    switch (row.rowLevel) {
      case 0:
        method = 'updateUser';
        break;
      case 1:
        method = 'updateAccount';
        break;
      case 2:
        method = 'updateTransaction';
        break;
    }
    this.businessService[method](row.data.id, updateInfo)
      .toPromise()
      .then(() => {
        this.gridEngine.filter();
      })
  }

  export() {
    this.gridEngine.exportToExcel(`financial_${formatDate(Date.now(), 'd_MMM_y_h:mm:ss_a', 'en_US')}.xlsx`)
  }
}
