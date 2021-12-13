import {Injectable} from '@angular/core';
import {AgrEngine, Column} from 'agr-lib';
import {ColumnFilter} from "agr-lib/lib/types/column-filter.types";

@Injectable()
export class AgrGridService<T> {
  gridEngine: AgrEngine<T> = new AgrEngine<T>([], {sectionMode: true});
  data: any[]

  constructor() {

  }

  getColumnFilterData(column: Column) {
    return this.gridEngine.getColumnFilterData(column)
  }

  switchSort(column: Column, multiple?: boolean) {
    this.gridEngine.switchSort(column, multiple);
  }

  switchFilter(column: Column, filter: ColumnFilter) {
    this.gridEngine.switchFilter(column, filter);
  }

  removeFilter(column: Column) {
    this.gridEngine.removeFilter(column);
  }

  getListFilterConditions() {
    return this.gridEngine.getListFilterConditions();
  }

  getFormulas() {
    return this.gridEngine.getFormulas();
  }

  changeFormula(column: Column, formula: string) {
    this.gridEngine.changeFormula(column, formula);
  }
}
