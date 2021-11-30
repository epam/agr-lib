import { Injectable } from '@angular/core';
import {RepositoryService} from "./repository.service";
import {map} from "rxjs/operators";
import {MapperService} from "./mapper.service";
import {MedicalRecord} from "./section-grid/medicalRecord";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class BusinessService {

  constructor(private repositoryService:RepositoryService) { }

  getSimpleTable():Observable<MedicalRecord[]>{
    return this.repositoryService.getSimpleTable()
      .pipe(map((data)=>MapperService.simpleTable(data)))
  }

  updateSimpleTable(id:string,updateInfo:Partial<MedicalRecord>){
    return this.repositoryService.updateSimpleTable(id,updateInfo);
  }
}
