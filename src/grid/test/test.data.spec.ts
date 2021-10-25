import { Column, ColumnFilterType } from '../../column/column.types';

export const columns: Column[] = [
  {
    title: 'Column1',
    field: 'column1',
  },
  {
    title: 'Column2',
    field: 'column2',
    /* eslint-disable @typescript-eslint/no-unused-vars */
    getDisplayValue(row: any): string {
      return 'displayValue';
    },
    getValue(row: any): any {
      return row?.b?.value;
    },
  },
  {
    title: 'Column3',
    field: 'column3',
    filterSettings: {
      type: ColumnFilterType.number,
    },
  },
  {
    title: 'Column4',
    field: 'column4',
  },
  {
    title: 'Column5',
    field: 'column5',
    filterSettings: {
      skipEmptyValues: true,
    },
  },
  {
    title: 'Column6',
    field: 'column6',
    filterSettings: {
      type: ColumnFilterType.date,
    },
  },
];

export const data = [
  {
    column1: 'rawValue',
    b: {
      value: 'getValue',
    },
    column3: 1,
    column4: ['a', 'b'],
    column6: '2020-01-30',
  },
  {
    column1: 'rawValue1',
    b: {
      value: 'getValue2',
    },
    column3: 2,
    column4: ['c'],
    column6: '2020-02-05',
  },
  {
    column3: 0,
    column4: ['a'],
  },
];
