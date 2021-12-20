import {CellData} from "./cell.types";

export const ColumnSortOrder = {
  asc: 'ASC',
  desc: 'DESC',
} as const;

export type ColumnSortOrderType = typeof ColumnSortOrder[keyof typeof ColumnSortOrder]

export const ColumnTypes = {
  date: 'date',
  number: 'number',
  text: 'text',
  reference: 'reference'
} as const;

export type ColumnType = typeof ColumnTypes[keyof typeof ColumnTypes];

export const ColumnFormulaTypes = {
  average: 'AVG',
  max: 'MAX',
  min: 'MIN',
  sum: 'SUM'
} as const;

export type ColumnFormulaType = typeof ColumnFormulaTypes[keyof typeof ColumnFormulaTypes];

export type ColumnEditableFunction = (data: CellData) => boolean
export  type ColumnEditable = boolean | ColumnEditableFunction | 'byRowLevel';
