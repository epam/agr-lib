import { Injectable } from '@angular/core';
import {AgrEngine, Column, ColumnSelectFilterValue} from 'agr-lib';
import {ColumnFilter} from "agr-lib/lib/column/column-filter.types";

@Injectable()
export class AgrGridService<T> {
  gridEngine:AgrEngine<T> = new AgrEngine<T>([],{sectionMode:true});
  data:any[]
  constructor() {

  }

  getColumnFilterValues(column: Column){
    return this.gridEngine.getColumnFilterValues(column)
  }

  switchSort(column:Column, multiple?:boolean){
    this.gridEngine.switchSort(column,multiple);
  }

  switchFilter(column: Column, filter:ColumnFilter){
    this.gridEngine.switchFilter(column,filter);
  }

  removeFilter(column:Column){
    this.gridEngine.removeFilter(column);
  }
  getListFilterConditions(){
    return this.gridEngine.getListFilterConditions();
  }
}
