export interface ColumnSelectFilterValue {
  label: string;
  value: any;
  selected?:boolean;
}

export const ColumnFilterTypes =  {
  select:'select',
  number:'number',
  date:'date',
  custom:'custom',
} as const

export type ColumnFilterType = typeof ColumnFilterTypes[keyof typeof ColumnFilterTypes]

export interface ColumnFilter{
  value?:string[];
  condition?:string;
}


