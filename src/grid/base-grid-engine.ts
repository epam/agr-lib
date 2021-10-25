import {
  Column,
  ColumnDateFilterData,
  ColumnFilterLogic,
  ColumnFilterSettings,
  ColumnFilterType,
  ColumnNumberFilterData,
  ColumnSettings,
  ColumnType,
} from '../column/column.types';
import { GridFilter, GridNumberFilterValues, GridSelectFilterValue, GridSort } from './grid.types';
import { orderBy, SortObject } from '../utils/orderBy';

export class BaseGridEngine<T> {
  private originalData: T[];
  private data_: T[];
  columns: Column[];
  filters = new Map<string, GridFilter>();
  sorts = new Map<string, GridSort>();

  get data(): T[] {
    return this.data_;
  }

  set data(value: T[]) {
    this.originalData = value;
    this.filter();
  }

  addFilter(filter: GridFilter) {
    //TODO Check empty filter's value. It's wrong add filter with empty value. Solution: exception or skip add?
    this.filters.set(
      filter.column.field,
      this.filters.has(filter.column.field) ? { ...this.filters.get(filter.column.field), ...filter } : filter
    );
    this.filter();
  }

  removeFilter(column: Column) {
    this.filters.delete(column.field);
    this.filter();
  }

  resetFilter() {
    this.filters.clear();
    this.filter();
  }

  filter(): void {
    let data = [...this.originalData];
    data = data.filter((row) => {
      let logicResult: boolean;
      let wasInit = false;
      for (const filter of this.filters.values()) {
        // Init value of logicResult depends on  logic condition from first filter: OR or AND
        if (!wasInit) {
          wasInit = true;
          logicResult = filter.logic !== ColumnFilterLogic.OR;
        }
        switch (filter.logic) {
          case ColumnFilterLogic.OR:
            logicResult ||= this.filterByColumn(filter, row);
            break;
          default:
            logicResult &&= this.filterByColumn(filter, row);
        }
      }
      return logicResult;
    });
    this.data_ = data;
    // this.sort();
  }

  protected filterByColumn(filter: GridFilter, row): boolean {
    const values = this.getValueAsArray(row, filter.column);
    const filterSettings = this.getColumnFilterSettings(filter.column);
    switch (filterSettings.type) {
      case ColumnFilterType.number:
        return this.filterNumberColumn(values, filter.data as ColumnNumberFilterData);
      case ColumnFilterType.date:
        return this.filterDateColumn(values, filter.data as ColumnDateFilterData);
      case ColumnFilterType.custom:
        return this.filterCustomColumn(row, filter);
      default:
        return this.filterSelectColumn(values, filter.data as []);
    }
  }

  protected filterSelectColumn(values: any[], filterData: any[]): boolean {
    for (const value of values) {
      const isIncluded = filterData.includes(value);
      if (isIncluded) {
        return true;
      }
    }
    return false;
  }

  protected filterNumberColumn(values: number[], filterData: ColumnNumberFilterData): boolean {
    for (const value of values) {
      if ((value >= filterData.min && value <= filterData.min) || (filterData.showEmpty && this.isEmptyValue(value))) {
        return true;
      }
    }
    return false;
  }

  protected filterDateColumn(values: any[], filterData: ColumnDateFilterData): boolean {
    for (const value of values) {
      if (this.isEmptyValue(value)) {
        return <boolean>filterData.showEmpty;
      }
      const valueAsDate = this.toDate(value);
      const filterAsDate = {
        startDate: this.toDate(filterData.startDate),
        endDate: this.toDate(filterData.endDate),
      };
      if (valueAsDate.getTime() >= filterAsDate.startDate.getTime() && valueAsDate.getTime() <= filterAsDate.endDate.getTime()) {
        return true;
      }
    }
    return false;
  }

  /* eslint-disable @typescript-eslint/no-unused-vars */
  protected filterCustomColumn(values: any[], filterValue: any): boolean {
    //It's stub for overriding custom filter in children
    return true;
  }

  addSort(sort: GridSort, multiple = false) {
    if (!multiple) {
      this.resetSort();
    }
    this.sorts.set(sort.column.field, sort);
  }

  removeSort(column: Column) {
    this.sorts.delete(column.field);
    this.sort();
  }

  resetSort() {
    this.sorts.clear();
    this.sort();
  }

  sort(): void {
    const sortKeys = [...this.sorts.values()].map<SortObject>((item) => {
      return {
        key: (row) => {
          const value = this.getColumnValue(row, item.column);
          switch (this.getColumnSettings(item.column).type) {
            case ColumnType.date:
              return new Date(value).getTime();
            default:
              return value;
          }
        },
        order: item.order,
      };
    });
    this.data_ = orderBy(this.data, sortKeys);
  }

  getColumnValue(row: T, column: Column): any {
    return column.getValue ? column.getValue(row) : row[column.field];
  }

  getColumnDisplayValue(row: T, column: Column) {
    return column.getDisplayValue ? column.getDisplayValue(row) : this.getColumnValue(row, column);
  }

  setColumnValue(data: any, column: Column, value: any) {
    column.setValue ? column.setValue(data, value) : (data[column.field] = value);
  }

  getColumnFilterValues(column: Column) {
    switch (column.filterSettings?.type ?? ColumnFilterType.select) {
      case ColumnFilterType.number:
        return this.getNumberFilterValues(column);
      case ColumnFilterType.custom:
        return this.getCustomFilterValues(column);
      default:
        return this.getSelectFilterValues(column);
    }
  }

  getSelectFilterValues(column: Column): GridSelectFilterValue[] {
    const filterSettings: ColumnFilterSettings = this.getColumnFilterSettings(column);
    const mapValues = new Map<any, GridSelectFilterValue>();
    for (const row of this.originalData) {
      const label = this.getColumnDisplayValue(row, column) ?? '';
      const tempValue = this.getColumnValue(row, column);
      const values = Array.isArray(tempValue) ? tempValue : [tempValue];
      if (!filterSettings.skipEmptyValues) {
        mapValues.set('', { label: '', value: '' });
      }
      for (const value of values) {
        if (filterSettings.skipEmptyValues && this.isEmptyValue(value)) {
          continue;
        }
        mapValues.set(value, {
          label,
          value: value,
        });
      }
    }
    return [...mapValues.values()];
    // return sortBy([...mapValues.values()],'label');
  }

  getNumberFilterValues(column: Column): GridNumberFilterValues {
    const filterValues: GridNumberFilterValues = {
      min: 0,
      max: 0,
    };
    for (const row of this.originalData) {
      const values = this.getValueAsArray(row, column);
      for (const value of values) {
        if (value > filterValues.max) {
          filterValues.max = value;
        }
        if (value < filterValues.min) {
          filterValues.min = value;
        }
      }
    }
    return filterValues;
  }

  getCustomFilterValues(column: Column) {
    //it's stub for custom filter. Developer can override method in child with some custom logic
  }

  private getColumnFilterSettings(column: Column): ColumnFilterSettings {
    return column.filterSettings ?? { type: ColumnFilterType.select, skipEmptyValues: false };
  }

  private getColumnSettings(column: Column): ColumnSettings {
    return column.settings ?? { type: ColumnType.text };
  }

  private getValueAsArray(row: T, column: Column) {
    const tempValue = this.getColumnValue(row, column);
    return Array.isArray(tempValue) ? tempValue : [tempValue];
  }

  private isEmptyValue(value) {
    return value === '' || value === undefined || value === null;
  }

  private toDate(value: string | Date): Date {
    return new Date(value);
  }
}
