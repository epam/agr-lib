import {Injectable} from '@angular/core';
import {RepositoryService} from "./repository.service";
import {map} from "rxjs/operators";
import {MapperService} from "./mapper.service";
import {MedicalRecord} from "./section-grid/medicalRecord";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class BusinessService {

  constructor(private repositoryService: RepositoryService) {
  }

  getSimpleTable(): Observable<MedicalRecord[]> {
    return this.repositoryService.getSimpleTable()
      .pipe(map((data) => MapperService.simpleTable(data)))
  }

  updateSimpleTable(id: string, updateInfo: Partial<MedicalRecord>) {
    return this.repositoryService.updateSimpleTable(id, MapperService.updateSimpleTable(updateInfo));
  }

  getAccountTypes() {
    return this.repositoryService.getAccountTypes();
  }

  getAccounts() {
    return this.repositoryService.getAccounts()
      .pipe(map((data) => MapperService.getAccounts(data)))
  }

  getFinancialUsers() {
    return this.repositoryService.getFinancialUsers();
  }

  getTransactionTypes() {
    return this.repositoryService.getTransactionTypes();
  }

  getTransactions() {
    return this.repositoryService.getTransactions();
  }

  updateAccount(id: string, updateInfo:any) {
    return this.repositoryService.updateAccount(id, updateInfo);
  }

  updateTransaction(id: string, updateInfo:any) {
    return this.repositoryService.updateTransaction(id, updateInfo);
  }

  updateUser(id: string, updateInfo:any) {
    return this.repositoryService.updateUser(id, updateInfo);
  }
}
