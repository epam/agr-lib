import { Injectable } from '@angular/core';
import {AgrGridService} from "../shared/grid/agr-grid.service";
import {financialGridColumnDefs} from "./financial-grid-columns";
import {combineLatest} from "rxjs";
import {BusinessService} from "../business.service";
import {formatDate} from "@angular/common";

@Injectable()
export class FinancialGridService extends AgrGridService<any> {
  private accounts;
  private accountTypes;
  private financialUsers;
  private transactionTypes;
  private transactions;

  constructor(private businessService:BusinessService) {
    super();
    this.gridEngine.setColumnDefs(financialGridColumnDefs());
  }

  refresh(){
    return combineLatest([
      this.businessService.getAccounts(),
      this.businessService.getAccountTypes(),
      this.businessService.getFinancialUsers(),
      this.businessService.getTransactionTypes(),
      this.businessService.getTransactions()
    ]).toPromise()
      .then(([accounts,accountTypes,financialUsers,transactionTypes,
             transaction])=>{
        this.accounts = accounts;
        this.accountTypes = accountTypes;
        this.financialUsers = financialUsers;
        this.transactionTypes = transactionTypes;
        this.transactions = transaction;
        // this.gridEngine.data = ;
        this.mapData();
      })
  }

  mapData(){
    const data = [];
    const hashAccountTypes = this.makeHash(this.accountTypes,'id')
    const hashTransactionTypes = this.makeHash(this.transactionTypes,'id')
    for(const user of this.financialUsers){
      data.push(user);
      user.children = [];
      for (const account of this.accounts){
        if (account.userId!==user.id){
          continue;
        }
        account.children = [];
        account.accountType = hashAccountTypes[account.accountTypeId];
        user.children.push(account);
        for (const transaction of this.transactions){
          if (transaction.accountId!==account.id){
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

  export(){
    this.gridEngine.exportToExcel(`financial_${formatDate(Date.now(), 'd_MMM_y_h:mm:ss_a','en_US')}.xlsx`)
  }
}
