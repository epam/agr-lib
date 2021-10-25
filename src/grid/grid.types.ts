import { Column, ColumnDateFilterData, ColumnNumberFilterData, ColumnFilterLogic } from '../column/column.types';

export interface GridSelectFilterValue {
  label: string;
  value: any;
}

export interface GridFilter {
  column: Column;
  data?: any[] | ColumnNumberFilterData | ColumnDateFilterData;
  logic?: ColumnFilterLogic;
}

export interface GridNumberFilterValues {
  min: number;
  max: number;
}

export enum GridSortOrder {
  asc = 'asc',
  desc = 'desc',
}

export interface GridSort {
  column: Column;
  order?: GridSortOrder;
}
