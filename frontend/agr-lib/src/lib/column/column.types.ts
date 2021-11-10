import {ColumnFilterType} from "./column-filter.types";

export const ColumnSortOrder = {
  asc:'ASC',
  desc:'DESC',
} as const;

export type ColumnSortOrderType = typeof ColumnSortOrder[keyof typeof ColumnSortOrder]

export const ColumnTypes  = {
  date : 'date',
  number : 'number',
  text : 'text',
} as const;

export type ColumnType = typeof ColumnTypes[keyof typeof ColumnTypes]



export interface ColumnFilterSettings {
  type?: ColumnFilterType;
  skipEmptyValues?: boolean;
}


export interface ColumnNumberFilterData {
  min: number;
  max: number;
  showEmpty?: boolean;
}

export interface ColumnDateFilterData {
  startDate: Date | string;
  endDate: Date | string;
  showEmpty?: boolean;
}
