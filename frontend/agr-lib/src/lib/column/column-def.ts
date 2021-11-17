import {ColumnSortOrderType, ColumnType} from "./column.types";
import {ColumnFilter, ColumnFilterType} from "./column-filter.types";

export interface ColumnDef {
  title: string;
  field: string;
  id?: string;
  columns?: ColumnDef[];
  colSpan?:number;
  rowSpan?:number;
  width?:number
  collapsible?: boolean;
  collapsed?:boolean;
  hideInCollapse?:boolean;
  sortable?:boolean;
  sort?:ColumnSortOrderType|null|''|undefined;
  type?:ColumnType
  filterable?:boolean;
  filter?:ColumnFilter;
  filterType?:ColumnFilterType;
  step?:number;//step for number filter
  pin?:boolean;

  data?:unknown;


  draggable?: boolean;
  editable?: boolean;
  getValue?(row: any, index?: any): any;

  getDisplayValue?(row: any, index?: any): string;

  setValue?(row: any, value: any): void;
}
