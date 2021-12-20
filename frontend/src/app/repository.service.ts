import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class RepositoryService {
  private options = {
    observe: 'body' as const,
    responseType: 'json' as const
  };

  constructor(private fetcher: HttpClient) {
  }

  getSimpleTable() {
    return this.fetcher.get('/api/simple-table', this.options)
  }

  updateSimpleTable(id:string,body: any) {
    return this.fetcher.patch(`/api/simple-table/${id}`, body, this.options)
  }

  getAccountTypes(){
    return this.fetcher.get('/api/financial/account-types', this.options)
  }

  getAccounts(){
    return this.fetcher.get('/api/financial/accounts', this.options)
  }

  getFinancialUsers(){
    return this.fetcher.get('/api/financial/financial-users', this.options)
  }

  getTransactionTypes(){
    return this.fetcher.get('/api/financial/transaction-types', this.options)
  }

  getTransactions(){
    return this.fetcher.get('/api/financial/transactions', this.options)
  }

  updateAccountTable(id:string,body:any){
    return this.fetcher.patch(`/api/financial/account/${id}`, body, this.options)
  }
}
