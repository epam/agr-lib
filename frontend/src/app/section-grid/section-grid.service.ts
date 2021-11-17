import {Injectable} from '@angular/core';
import {AgrGridService} from "../shared/grid/agr-grid.service";
import {SectionGridColumnDefs} from "./section-grid-columns";
import {MedicalRecord} from "./medicalRecord";

// import {SectionGridColumnDefs} from "./section-grid-columns";

@Injectable()
export class SectionGridService extends AgrGridService<MedicalRecord> {

  constructor() {
    super();
    this.gridEngine.setColumnDefs(SectionGridColumnDefs());
    this.gridEngine.data = [
      {
        index_number: 1,
        firstName: 'Test2',
        tempIn9: 36.6
      },
      {
        index_number: 2,
        firstName: 'Test1',
        tempIn9: 37.6
      },
      {
        index_number: 2,
        firstName: 'Test1',
        tempIn9: 38.6
      }
    ]
  }


}
