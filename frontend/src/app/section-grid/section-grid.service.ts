import {EventEmitter, Injectable} from '@angular/core';
import {AgrGridService} from "../shared/grid/agr-grid.service";
import {SectionGridColumnDefs} from "./section-grid-columns";
import {MedicalRecord} from "./medicalRecord";
import {BusinessService} from "../business.service";


@Injectable()
export class SectionGridService extends AgrGridService<MedicalRecord> {
  constructor(private businessService:BusinessService) {
    super();
    this.gridEngine.setColumnDefs(SectionGridColumnDefs());
  }

  refresh(){
    this.businessService.getSimpleTable()
      .toPromise()
      .then((data)=>{
        console.log(data)
        this.gridEngine.data = data;
      })
  }

}
