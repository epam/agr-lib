import {EventEmitter, Injectable} from '@angular/core';
import {AgrGridService} from "../shared/grid/agr-grid.service";
import {SectionGridColumnDefs} from "./section-grid-columns";
import {MedicalRecord} from "./medicalRecord";
import {BusinessService} from "../business.service";
import {Column, ColumnHelper} from "agr-lib";
import {formatDate} from "@angular/common";
import {AppProgressSpinnerService} from "../shared/app-progress-spinner/app-progress-spinner.service";


@Injectable()
export class SectionGridService extends AgrGridService<MedicalRecord> {
  constructor(private businessService: BusinessService,
              private progressSpinner:AppProgressSpinnerService) {
    super();
    this.gridEngine.setColumnDefs(SectionGridColumnDefs());
  }

  refresh() {
    this.progressSpinner.show();
    this.businessService.getSimpleTable()
      .toPromise()
      .then((data) => {
        this.gridEngine.data = data;
      })
      .finally(()=>{
        this.progressSpinner.hide();
      })
  }

  update(row: any, column: Column, update: any) {
    ColumnHelper.setColumnValue(row, column.columnDef, update);
    return this.businessService.updateSimpleTable(row.id, {
      [column.columnDef.field]: update
    })
      .toPromise()
      .then(() => {
      })
  }

  export() {
    this.progressSpinner.show();
    this.gridEngine
      .exportToExcel(`medical_${formatDate(Date.now(), 'd_MMM_y_h:mm:ss_a', 'en_US')}.xlsx`)
      .finally(()=>{
        this.progressSpinner.hide();
      })
  }
}
