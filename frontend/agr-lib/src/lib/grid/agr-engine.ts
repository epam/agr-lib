import orderBy from 'lodash-es/orderBy';
import {ColumnDef} from "../column/column-def";
import {Column} from "../column/column";
import {ColumnSortOrder, ColumnSortOrderType, ColumnTypes} from "../column/column.types";
import {ColumnFilter, ColumnFilterTypes, ColumnSelectFilterValue} from "../column/column-filter.types";

interface ColumnStack {
  column: Column;
  parent?: Column
  rowIndex: number;
  collapsed?: boolean;
  visited?: boolean;
}

export interface AgrEngineOptions {
  unSortColumn?: boolean;
  sectionMode?:boolean;
}

export class AgrEngine<T> {
  header: Column[][] = [];
  body: Column[] = [];
  frozenHeader: Column[][] = [];
  frozenBody: Column[] = [];
  _data: T[] = [];
  _originalData: T[] = [];
  options: AgrEngineOptions;
  private sortColumnsData = new Map<string, ColumnDef>();
  private filterColumnsData = new Map<string, ColumnDef>();

  get data(): T[] {
    return this._data
  }

  set data(v) {
    this._originalData = v;
    this.filter();
  }

  constructor(private columnDefs: ColumnDef[], options?: AgrEngineOptions) {
    this.options = {
      ...{
        unSortColumn: false
      },
      ...options
    }
    //TODO May be need deep clone that encapsulate
    this.columnDefs = columnDefs;
    this.createColumns(columnDefs);
  }

  setColumnDefs(columnDefs: ColumnDef[]) {
    this.columnDefs = columnDefs;
    this.createColumns(columnDefs);
  }

  //TODO Write test for logic
  private createColumns(columnsDefinition: ColumnDef[]) {
    this.header = [];
    this.body = [];
    this.frozenHeader = []
    this.frozenBody = []
    let stack: ColumnStack[] = columnsDefinition.map((columnDef) => {
      return {
        column: new Column(columnDef, null),
        rowIndex: 0,
        collapsed: columnDef.collapsed
      };
    })
    let count = 0
    while (stack.length > 0) {
      if (count++ > 1000) {
        return;
      }
      let current = stack[0];
      if ((this.header.length === 0 && current.rowIndex === 0) || this.header.length < current.rowIndex + 1) {
        this.header.push([]);
        this.frozenHeader.push([]);
      }
      if (Array.isArray(current.column.columnDef.columns)
        && current.column.columnDef.columns.length > 0 && !current.visited) {
        current.visited = true;
        current.column.colSpan = 0;
        const newStack = current.column.columnDef.columns
          .filter((columnDef) => {
            let collapsed = current.collapsed || columnDef.collapsed
            return collapsed ? this.isVisibleInCollapse(columnDef) : true;
          })
          .map((columnDef) => {
            const column = new Column(columnDef, current.column);
            current.column.columns.push(column);
            return {
              column,
              rowIndex: current.rowIndex + 1,
              collapsed: current.collapsed || columnDef.collapsed
            };
          })
        stack = [
          ...newStack,
          ...stack
        ]
        continue;
      }
      current = stack.shift();
      this.header[current.rowIndex].push(current.column)
      if (Array.isArray(current.column.columns)
        && current.column.columns.length > 0) {
      } else {
        this.body.push(current.column);
        let parent = current.column.parent;
        while (parent) {
          parent.colSpan++;
          parent = parent.parent;
        }
      }
    }
    let rowSpan = 1;
    for (let rowIndex = this.header.length - 2; rowIndex >= 0; rowIndex--) {
      rowSpan++;
      for (const column of this.header[rowIndex]) {
        if (!Array.isArray(column.columns) || column.columns.length === 0) {
          column.rowSpan = rowSpan;
        }
      }
    }
  }


  private isGroup(columnDef: ColumnDef) {
    return Array.isArray(columnDef.columns) && columnDef.columns.length > 0;
  }

  private isVisibleInCollapse(columnDef: ColumnDef) {
    return this.isGroup(columnDef) ? true : !columnDef.hideInCollapse
  }

//TODO Test
  toggleCollapse(column: Column) {
    column.columnDef.collapsed = !column.columnDef.collapsed;
    this.createColumns(this.columnDefs);
  }

//TODO Test
  switchSort(column: Column, multiple?: boolean) {
    switch (column.columnDef.sort) {
      case ColumnSortOrder.asc:
        this.addSort(column, ColumnSortOrder.desc, multiple);
        break
      case ColumnSortOrder.desc:
        this.options.unSortColumn ? this.removeSort(column) : this.addSort(column, ColumnSortOrder.asc, multiple);
        break;
      default:
        this.addSort(column, ColumnSortOrder.asc, multiple);
    }
  }
//TODO Test
  resetSort() {
    for (const columnDef of [...this.sortColumnsData.values()]) {
      columnDef.sort = null;
    }
    this.sortColumnsData.clear();
  }
//TODO Test
  addSort(column: Column, order: ColumnSortOrderType, multiple?: boolean) {
    if (!multiple) {
      this.resetSort();
    }
    column.columnDef.sort = order;
    this.sortColumnsData.set(column.getColumnId(), column.columnDef);
    this.sort();
  }
//TODO Test
  removeSort(column: Column) {
    column.columnDef.sort = null;
    this.sortColumnsData.delete(column.getColumnId());
    this.sort();
  }

  sort() {
    const sorts = [];
    const orders = [];
    for (const columnDef of this.sortColumnsData.values()) {
      sorts.push((item) => {
        let columnValue;
        switch (columnDef.type) {
          case ColumnTypes.date:
            columnValue = new Date(this.getColumnValue(item, columnDef)).getTime();
            break;
          default:
            columnValue = this.getColumnValue(item, columnDef) ?? '';
        }
        return columnValue;
      });
      orders.push(columnDef.sort === ColumnSortOrder.asc ? 'asc' : 'desc');
    }
    this.data = orderBy(this.data, sorts, orders);
  }

  getColumnValue(row: T, columnDef: ColumnDef): any {
    return columnDef.getValue ? columnDef.getValue(row) : row[columnDef.field];
  }

  getColumnDisplayValue(row: T, columnDef: ColumnDef) {
    return columnDef.getDisplayValue ? columnDef.getDisplayValue(row) : this.getColumnValue(row, columnDef);
  }

  setColumnValue(data: any, columnDef: ColumnDef, value: any) {
    columnDef.setValue ? columnDef.setValue(data, value) : (data[columnDef.field] = value);
  }
//TODO Test
  getListFilterConditions():string[]{
     const conditions = ['AND','OR'];
     if (this.options.sectionMode){
       conditions.push('OR_GROUP');
     }
     return conditions;
  }
//TODO Test
  switchFilter(column: Column, filter: ColumnFilter) {
    //TODO Make checking for other types
    if (filter.value.length === 0) {
      this.removeFilter(column);
      return;
    }
    column.columnDef.filter = filter;
    this.filterColumnsData.set(column.getColumnId(),column.columnDef);
    this.filter();
  }
//TODO Test
  removeFilter(column: Column) {
    this.filterColumnsData.delete(column.getColumnId());
    column.columnDef.filter = null;
    this.filter();
  }
//TODO Test
  resetFilter(){
    for (const columnDef of [...this.filterColumnsData.values()]) {
      columnDef.filter = null;
    }
    this.filterColumnsData.clear();
    this.filter();
  }
//TODO Test
  getColumnFilterValues(column: Column): ColumnSelectFilterValue[] {
    switch (column.columnDef.filterType ?? ColumnFilterTypes.select) {
      //     case ColumnFilterType.number:
      //       return this.getNumberFilterValues(column);
      //     case ColumnFilterType.custom:
      //       return this.getCustomFilterValues(column);
      default:
        return this.getSelectFilterValues(column);
    }
  }
//TODO Test
  getSelectFilterValues(column: Column): ColumnSelectFilterValue[] {
    const mapValues = new Map<any, ColumnSelectFilterValue>();
    for (const row of this._originalData) {
      const label = this.getColumnDisplayValue(row, column.columnDef) ?? '';
      const tempValue = this.getColumnValue(row, column.columnDef);
      const values = Array.isArray(tempValue) ? tempValue : [tempValue];
      //TODO Make grid options skipEmptyValues and column property  allows empty
      if (!column.columnDef.skipEmptyValues) {
        mapValues.set('', {label: '', value: '',selected: this.isSelectedFilterValue(column,'')});
      }
      for (const value of values) {
        if (column.columnDef.skipEmptyValues && this.isEmptyValue(value)) {
          continue;
        }
        mapValues.set(value, {
          label,
          value: value,
          selected: this.isSelectedFilterValue(column,value)
        });
      }
    }
    return [...mapValues.values()];
    // return sortBy([...mapValues.values()],'label');
  }
  private isSelectedFilterValue(column: Column,value:any){
    if (!this.filterColumnsData.has(column.getColumnId())){
      return false;
    }
    return (this.filterColumnsData.get(column.getColumnId()).filter as ColumnFilter).value.includes(value)
  }

  // getNumberFilterValues(column: Column): GridNumberFilterValues {
  //   const filterValues: GridNumberFilterValues = {
  //     min: 0,
  //     max: 0,
  //   };
  //   for (const row of this.originalData) {
  //     const values = this.getValueAsArray(row, column);
  //     for (const value of values) {
  //       if (value > filterValues.max) {
  //         filterValues.max = value;
  //       }
  //       if (value < filterValues.min) {
  //         filterValues.min = value;
  //       }
  //     }
  //   }
  //   return filterValues;
  // }
  //
  // getCustomFilterValues(column: Column) {
  //   //it's stub for custom filter. Developer can override method in child with some custom logic
  // }
//TODO Test
  filter() {
    let data = [...this._originalData];
    data = data.filter((row) => {
      let logicResult = true;
      let wasInit = false;
      for (const columnDef of this.filterColumnsData.values()) {
        // Re-init value of logicResult depends on  logic condition from first filter: OR or AND
        if (!wasInit) {
          wasInit = true;
          logicResult = (columnDef.filter as ColumnFilter).condition !== 'OR';
        }
        switch ((columnDef.filter as ColumnFilter).condition) {
          case 'OR':
            logicResult ||= this.filterByColumn(columnDef, row);
            break;
          default:
            logicResult &&= this.filterByColumn(columnDef, row);
        }
      }
      return logicResult;
    });
    this._data = data;
  }

  protected filterByColumn(columnDef:ColumnDef, row): boolean {
    const values = this.getValueAsArray(row, columnDef);
    switch (columnDef.filterType) {
      // case ColumnFilterTypes.number:
      //   return this.filterNumberColumn(values, filter.data as ColumnNumberFilterData);
      // case ColumnFilterType.date:
      //   return this.filterDateColumn(values, filter.data as ColumnDateFilterData);
      // case ColumnFilterType.custom:
      //   return this.filterCustomColumn(row, filter);
      default:
        return this.filterSelectColumn(values, (columnDef.filter as ColumnFilter).value);
    }
  }

  protected filterSelectColumn(columnValues: any[], filterValue: any[]): boolean {
    for (const value of columnValues) {
      const isIncluded = filterValue.includes(value);
      if (isIncluded) {
        return true;
      }
    }
    return false;
  }

  // protected filterNumberColumn(values: number[], filterData: ColumnNumberFilterData): boolean {
  //   for (const value of values) {
  //     if ((value >= filterData.min && value <= filterData.min) || (filterData.showEmpty && this.isEmptyValue(value))) {
  //       return true;
  //     }
  //   }
  //   return false;
  // }
  //
  // protected filterDateColumn(values: any[], filterData: ColumnDateFilterData): boolean {
  //   for (const value of values) {
  //     if (this.isEmptyValue(value)) {
  //       return <boolean>filterData.showEmpty;
  //     }
  //     const valueAsDate = this.toDate(value);
  //     const filterAsDate = {
  //       startDate: this.toDate(filterData.startDate),
  //       endDate: this.toDate(filterData.endDate),
  //     };
  //     if (valueAsDate.getTime() >= filterAsDate.startDate.getTime() && valueAsDate.getTime() <= filterAsDate.endDate.getTime()) {
  //       return true;
  //     }
  //   }
  //   return false;
  // }

  /* eslint-disable @typescript-eslint/no-unused-vars */
  protected filterCustomColumn(values: any[], filterValue: any): boolean {
    //It's stub for overriding custom filter in children
    return true;
  }


  private isEmptyValue(value) {
    return value === '' || value === undefined || value === null;
  }

  private getValueAsArray(row: T, columnDef: ColumnDef) {
    const tempValue = this.getColumnValue(row, columnDef);
    return Array.isArray(tempValue) ? tempValue : [tempValue];
  }

  private toDate(value: string | Date): Date {
    return new Date(value);
  }
}
