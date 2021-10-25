export enum ColumnType {
  date = 'date',
  number = 'number',
  text = 'text',
}

export interface ColumnSettings {
  draggable?: boolean;
  editable?: boolean;
  sortable?: boolean;
  filterable?: boolean;
  type?: ColumnType;
}

export enum ColumnFilterType {
  select,
  number,
  date,
  custom,
}

export enum ColumnFilterLogic {
  AND,
  OR,
  OR_SECTION,
}

export interface ColumnFilterSettings {
  type?: ColumnFilterType;
  skipEmptyValues?: boolean;
}

export interface Column {
  title: string;
  field: string;
  settings?: ColumnSettings;
  filterSettings?: ColumnFilterSettings;

  getValue?(row: any, index?: any): any;

  getDisplayValue?(row: any, index?: any): string;

  setValue?(row: any, value: any): void;
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
