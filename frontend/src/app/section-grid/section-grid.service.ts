import {EventEmitter, Injectable} from '@angular/core';
import {AgrGridService} from "../shared/grid/agr-grid.service";
import {SectionGridColumnDefs} from "./section-grid-columns";
import {MedicalRecord} from "./medicalRecord";
import {BusinessService} from "../business.service";
import {Column, ColumnHelper} from "agr-lib";


@Injectable()
export class SectionGridService extends AgrGridService<MedicalRecord> {
  constructor(private businessService: BusinessService) {
    super();
    this.gridEngine.setColumnDefs(SectionGridColumnDefs());
  }

  refresh() {
    this.businessService.getSimpleTable()
      .toPromise()
      .then((data) => {
        console.log(data)
        this.gridEngine.data = data;
      })
  }

  update(row: any, column: Column, update: any) {
    ColumnHelper.setColumnValue(row,column.columnDef,update);
    return this.businessService.updateSimpleTable(row.id, {
      [column.columnDef.field]: update
    })
      .toPromise()
      .then(()=>{
      })
  }

}
