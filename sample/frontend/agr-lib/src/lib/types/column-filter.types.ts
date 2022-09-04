
export const ColumnFilterTypes =  {
  select:'select',
  number:'number',
  date:'date',
  custom:'custom',
} as const

export type ColumnFilterType = typeof ColumnFilterTypes[keyof typeof ColumnFilterTypes]
export type ColumnFilterValueType = string[]|ColumnNumberFilterData|ColumnDateFilterData
export type ColumnFilterDataType = ColumnSelectFilterData[]|ColumnNumberFilterData|ColumnDateFilterData

export interface ColumnFilter{
  value?:ColumnFilterValueType;
  condition?:string;
  showEmpty?:boolean;
}

export interface ColumnSelectFilterData {
  label: string;
  value: any;
}

export interface ColumnNumberFilterData {
  min: number;
  max: number;
}

export interface ColumnDateFilterData {
  startDate: Date | string;
  endDate: Date | string;
}
