import {Injectable} from '@angular/core';
import {Column} from "agr-lib";
import {ColumnFilter} from "agr-lib/lib/types/column-filter.types";

@Injectable()
export abstract class AgrGridFilterSortService {
  protected constructor() {
  }

  abstract getColumnFilterData(column: Column);

  abstract switchSort(column: Column, multiple?: boolean)

  abstract resetSort();

  abstract switchFilter(column: Column, filter: ColumnFilter)

  abstract removeFilter(column: Column)

  abstract getListFilterConditions(): string[];

  abstract getFormulas(): string[];

  abstract changeFormula(column: Column, formula: string);

}

