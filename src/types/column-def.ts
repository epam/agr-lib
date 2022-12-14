import { ColumnEditable, ColumnSortOrderType, ColumnType } from './column.types';
import { ColumnFilter, ColumnFilterType } from './column-filter.types';

export interface ColumnDef {
  title: string;
  field: string;
  id?: string;
  columns?: ColumnDef[];
  colSpan?: number;
  rowSpan?: number;
  width?: number;
  collapsible?: boolean;
  collapsed?: boolean;
  hideInCollapse?: boolean;
  sortable?: boolean;
  sort?: ColumnSortOrderType | null | '' | undefined;
  rowLevel?: number | number[];
  type?: ColumnType;
  filterable?: boolean;
  filter?: ColumnFilter;
  filterType?: ColumnFilterType;
  step?: number; //step for number filter
  pin?: boolean;
  pinned?: boolean;
  dragDisabled?: boolean;
  data?: unknown;
  formula?: string;
  formulaResult?: number;
  showFooter?: boolean;
  editable?: ColumnEditable;
  editMin?: number;
  editMax?: number;
  skipExport?: boolean;

  getValue?(row: any, index?: any): any;

  getDisplayValue?(row: any, index?: any): string;

  setValue?(row: any, value: any): void;
}
