import orderBy from 'lodash-es/orderBy.js';
import sortBy from 'lodash-es/sortBy.js';
import cloneDeep from 'lodash-es/cloneDeep.js';
import {ColumnDef} from "../types/column-def";
import {Column} from "../types/column";
import {
  ColumnFormulaTypes,
  ColumnSortOrder,
  ColumnSortOrderType,
  ColumnTypes
} from "../types/column.types";
import {
  ColumnDateFilterData,
  ColumnFilter, ColumnFilterDataType,
  ColumnFilterTypes,
  ColumnNumberFilterData,
  ColumnSelectFilterData
} from "../types/column-filter.types";
import {ColumnHelper} from "../types/column-helper";
import {Row} from "../types/row";

interface ColumnStack {
  column: Column;
  parent?: Column
  rowIndex: number;
  collapsed?: boolean;
  pinned?: boolean;
  visited?: boolean;
}

export interface AgrEngineOptions {
  unSortColumn?: boolean; //TODO Rename property because unclear what is made
  sectionMode?: boolean;
  nameRowChildrenProperty?: string;
  nameRowParentProperty?: string;
}

export class AgrEngine<T> {
  header: Column[][] = [];
  body: Column[] = [];
  rows: Row<T>[] = [];
  private rowsCache: Row<T>[] = [];
  frozenHeader: Column[][] = [];
  frozenBody: Column[] = [];
  _originalData: T[] = [];
  options: AgrEngineOptions;
  private sortColumnsData = new Map<string, ColumnDef>();
  private filterColumnsData = new Map<string, ColumnDef | ColumnDef[]>();
  private draggedColumn: Column;
  private originalColumnDefs: ColumnDef[];
  selectedAll: boolean;

  get data(): T[] {
    return this._originalData;
  }

  set data(data) {
    this._originalData = data;
    this.createRows();
    this.filter();
  }

  constructor(private columnDefs: ColumnDef[], options?: AgrEngineOptions) {
    this.options = {
      ...{
        unSortColumn: false,
        nameRowChildrenProperty: 'children',
        nameRowParentProperty: 'row'
      },
      ...options
    }
    //TODO May be need deep clone that encapsulate
    this.originalColumnDefs = columnDefs;
    this.columnDefs = columnDefs;
    // this.columnDefs = cloneDeep(columnDefs);
    this.createColumns(columnDefs);
  }

  setColumnDefs(columnDefs: ColumnDef[]) {
    this.columnDefs = columnDefs;
    this.createColumns(columnDefs);
  }

  //TODO Write test for logic
  //TODO Think about simplify
  private createColumns(columnsDefinition: ColumnDef[]) {
    this.header = [];
    this.body = [];
    this.frozenHeader = []
    this.frozenBody = []
    let header = [];
    let body = [];
    let stack: ColumnStack[] = columnsDefinition.map((columnDef) => {
      return {
        column: new Column(columnDef, null),
        rowIndex: 0,
        collapsed: columnDef.collapsed,
        pinned: columnDef.pinned
      };
    })
    let count = 0
    while (stack.length > 0) {
      if (count++ > 1000) {
        return;
      }
      let current = stack[0];
      if ((header.length === 0 && current.rowIndex === 0) || header.length < current.rowIndex + 1) {
        header.push([]);
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
              collapsed: current.collapsed || columnDef.collapsed,
              pinned: current.pinned || columnDef.pinned
            };
          })
        stack = [
          ...newStack,
          ...stack
        ]
        continue;
      }
      current = stack.shift();
      header[current.rowIndex].push(current)
      if (!Array.isArray(current.column.columns)
        || current.column.columns.length === 0) {
        body.push(current);
        let parent = current.column.parent;
        while (parent) {
          parent.colSpan++;
          parent = parent.parent;
        }
      }
    }
    let rowSpan = 1;
    for (let rowIndex = header.length - 2; rowIndex >= 0; rowIndex--) {
      rowSpan++;
      for (const columnStack of header[rowIndex]) {
        if (!Array.isArray(columnStack.column.columns) || columnStack.column.columns.length === 0) {
          columnStack.column.rowSpan = rowSpan;
        }

      }
    }
    if (this.options.sectionMode && header.length > 0) {
      for (const columnStack of header[0]) {
        columnStack.column.isLast = true;
        let children = columnStack.column.columns;
        while (children) {
          const lastChild = children[children.length - 1];
          lastChild.isLast = true;
          children = Array.isArray(lastChild.columns) && lastChild.columns.length > 0 ? lastChild.columns : null;
        }
      }
    }
    for (const row of header) {
      this.header.push([]);
      this.frozenHeader.push([]);
      for (const columnStack of row) {
        columnStack.pinned ? this.frozenHeader[columnStack.rowIndex].push(columnStack.column)
          : this.header[columnStack.rowIndex].push(columnStack.column);
      }
      const helperColumn = new Column({title: 'r', field: 'r'});
      this.frozenHeader[this.frozenHeader.length - 1].push(helperColumn);
      // if (this.frozenHeader[this.frozenHeader.length-1].length===0){
      //   // this.frozenHeader[this.frozenHeader.length-1].push(new Column({title:'',field:''}))
      // }
    }
    for (const columnStack of body) {
      columnStack.pinned ? this.frozenBody.push(columnStack.column) : this.body.push(columnStack.column);
    }
    // console.log('frozen', this.frozenHeader);
    // console.log('header', this.header);
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

  togglePin(column: Column) {
    column.columnDef.pinned = !column.columnDef.pinned;
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
            columnValue = new Date(ColumnHelper.getColumnValue(item.data, columnDef)).getTime();
            break;
          default:
            columnValue = ColumnHelper.getColumnValue(item.data, columnDef) ?? '';
            if (typeof columnValue === 'string') {
              columnValue = columnValue.toLowerCase();
            }
        }
        return columnValue;
      });
      orders.push(columnDef.sort === ColumnSortOrder.asc ? 'asc' : 'desc');
    }
    this.rows = orderBy(this.rows, sorts, orders);
  }

  // getColumnValue(row: T, columnDef: ColumnDef): any {
  //   return columnDef.getValue ? columnDef.getValue(row) : row[columnDef.field];
  // }
  //
  // getColumnDisplayValue(row: T, column: Column) {
  //   return ColumnHelper.getColumnDisplayValue(row,column);
  // }

  setColumnValue(data: any, columnDef: ColumnDef, value: any) {
    columnDef.setValue ? columnDef.setValue(data, value) : (data[columnDef.field] = value);
  }

//TODO Test
  getListFilterConditions(): string[] {
    const conditions = ['AND', 'OR'];
    if (this.options.sectionMode) {
      conditions.push('OR_GROUP');
    }
    return conditions;
  }

//TODO Test
  switchFilter(column: Column, filter: ColumnFilter) {
    if (!filter.value || (filter.value as string[]).length === 0) {
      this.removeFilter(column);
      return;
    }
    column.columnDef.filter = filter;
    if (column.columnDef.filter.condition === 'OR_GROUP') {
      this.filterColumnsData.delete(column.getColumnId());
      const columnId = column.parent ? column.parent.getColumnId() : column.getColumnId();
      if (!this.filterColumnsData.has(columnId)) {
        this.filterColumnsData.set(columnId, []);
      }
      (this.filterColumnsData.get(columnId) as ColumnDef[]).push(column.columnDef);
    } else {
      this.filterColumnsData.set(column.getColumnId(), column.columnDef);
    }
    this.filter();
  }

//TODO Test
  removeFilter(column: Column, skipFilter = false) {
    this.filterColumnsData.delete(column.getColumnId());
    column.columnDef.filter = null;
    if (!skipFilter) {
      this.filter();
    }
  }

//TODO Test
  resetFilter() {
    for (const columnDef of [...this.filterColumnsData.values()]) {
      columnDef.filter = null;
    }
    this.filterColumnsData.clear();
    this.filter();
  }

//TODO Test
  getColumnFilterData(column: Column): ColumnFilterDataType {
    switch (column.columnDef.filterType ?? ColumnFilterTypes.select) {
      case ColumnFilterTypes.number:
        return this.getNumberFilterData(column);
      case ColumnFilterTypes.date:
        return this.getDateFilterData(column);
      //     case ColumnFilterType.custom:
      //       return this.getCustomFilterValues(column);
      default:
        return this.getSelectFilterValues(column);
    }
  }

//TODO Test
  getSelectFilterValues(column: Column): ColumnSelectFilterData[] {
    const mapValues = new Map<any, ColumnSelectFilterData>();
    for (const row of this.rowsCache) {
      const label = ColumnHelper.getColumnDisplayValue(row.data, column.columnDef) ?? '';
      const tempValue = ColumnHelper.getColumnValue(row.data, column.columnDef);
      const values = Array.isArray(tempValue) ? tempValue : [tempValue];
      for (const value of values) {
        if (this.isEmptyValue(value)) {
          continue;
        }
        mapValues.set(value, {
          label,
          value: value
        });
      }
    }
    return sortBy([...mapValues.values()], 'label');
  }

  getNumberFilterData(column: Column): ColumnNumberFilterData {
    let filterData: ColumnNumberFilterData
    let wasInit = false;
    for (const row of this.rowsCache) {
      const values = this.getValueAsArray(row.data, column.columnDef);
      for (const value of values) {
        if (isNaN(value)) {
          continue;
        }
        if (!wasInit) {
          wasInit = true;
          filterData = {
            min: value,
            max: value
          }
        }
        if (value > filterData.max) {
          filterData.max = value;
        }
        if (value < filterData.min) {
          filterData.min = value;
        }
      }
    }
    return filterData;
  }

  getDateFilterData(column: Column): ColumnDateFilterData {
    let filterData: ColumnDateFilterData
    let wasInit = false;
    for (const row of this.rowsCache) {
      const values = this.getValueAsArray(row.data, column.columnDef);
      for (let value of values) {
        if (!value) {
          continue;
        }
        try {
          value = new Date(value);
        } catch {
          continue;
        }
        if (!wasInit) {
          wasInit = true;
          filterData = {
            startDate: value,
            endDate: value
          }
        }
        // if (value.getTime() > filterData.startDate.getTime()) {
        //   filterData.max = value;
        // }
        // if (value < filterData.min) {
        //   filterData.min = value;
        // }
      }
    }
    return filterData;
  }

  //
  // getCustomFilterValues(column: Column) {
  //   //it's stub for custom filter. Developer can override method in child with some custom logic
  // }
//TODO Test
  filter() {
    let data = [...this.rowsCache];
    data = data.filter((row) => {
      let logicResult = true;
      let wasReInit = false;
      for (const columnDef of this.filterColumnsData.values()) {
        if (Array.isArray(columnDef)) {
          let groupLogicResult = false;
          if (!wasReInit) {
            logicResult = true;
            wasReInit = true;
          }
          for (const childColumnDef of columnDef) {
            groupLogicResult ||= (this.filterByColumn(childColumnDef, row) ||
              this.filterChild((row as any).children, childColumnDef) ||
              this.filterParent(row, childColumnDef));
          }
          logicResult &&= groupLogicResult;
        } else {
          // Re-init value of logicResult depends on  logic condition from first filter: OR or AND
          if (!wasReInit) {
            wasReInit = true;
            logicResult = columnDef.filter.condition !== 'OR';
          }
          switch (columnDef.filter.condition) {
            case 'OR':
              logicResult ||= (this.filterByColumn(columnDef, row) ||
                this.filterChild((row as any).children, columnDef) ||
                this.filterParent(row, columnDef));
              break;
            default:
              logicResult &&= (this.filterByColumn(columnDef, row) ||
                this.filterChild((row as any).children, columnDef) ||
                this.filterParent(row, columnDef));
          }
        }
      }
      return logicResult;
    });
    this.rows = data;
    this.sort();
  }

  protected filterByColumn(columnDef: ColumnDef, row: Row<T>): boolean {
    const values = this.getValueAsArray(row.data, columnDef);
    let columnResult = false;
    for (const value of values) {
      if (columnDef.filter.showEmpty && this.isEmptyValue(value)) {
        return true;
      }
      switch (columnDef.filterType) {
        case ColumnFilterTypes.number:
          columnResult = this.filterNumberColumn(value, columnDef.filter.value as ColumnNumberFilterData);
          break;
        case ColumnFilterTypes.date:
          columnResult = this.filterDateColumn(value, columnDef.filter.value as ColumnDateFilterData);
          break;
        // case ColumnFilterType.custom:
        //   return this.filterCustomColumn(row, filter);
        default:
          columnResult = this.filterSelectColumn(value, (columnDef.filter.value as string[]));
      }
      if (columnResult) {
        return true;
      }
    }
    return false;
  }

  filterChild(children: Row<T>[], columnDef: ColumnDef) {
    if (children) {
      for (const child of children) {
        const logicResult = this.filterByColumn(columnDef, child) || this.filterChild(child.children, columnDef);
        if (logicResult) {
          return true;
        }
      }
    }
    return false;
  }

  filterParent(row: Row<T>, columnDef: ColumnDef) {
    let parent = row.parent;
    while (parent) {
      if (this.filterByColumn(columnDef, parent)) {
        return true;
      }
      parent = parent.parent;
    }
    return false;
  }

  protected filterSelectColumn(value, filterValue: string[]): boolean {
    return filterValue.includes(value);
  }

  protected filterNumberColumn(value, filterValue: ColumnNumberFilterData): boolean {
    return value >= filterValue.min && value <= filterValue.max;
  }

  protected filterDateColumn(value, filterValue: ColumnDateFilterData): boolean {
    const filterAsDate = {
      startDate: this.toDate(filterValue.startDate),
      endDate: this.toDate(filterValue.endDate),
    };
    const valueAsDate = this.toDate(value);
    return valueAsDate.getTime() >= filterAsDate.startDate.getTime() && valueAsDate.getTime() <= filterAsDate.endDate.getTime()
  }

  /* eslint-disable @typescript-eslint/no-unused-vars */
  protected filterCustomColumn(values: any[], filterValue: any): boolean {
    //It's stub for overriding custom filter in children
    return true;
  }


  private isEmptyValue(value) {
    return value === '' || value === undefined || value === null;
  }

  private getValueAsArray(row: T, columnDef: ColumnDef) {
    const tempValue = ColumnHelper.getColumnValue(row, columnDef);
    return Array.isArray(tempValue) ? tempValue : [tempValue];
  }

  private toDate(value: string | Date): Date {
    const date = new Date(value);
    date.setHours(0, 0, 0, 0);
    return date;
  }

  dragStartColumn(column: Column) {
    this.draggedColumn = column;
  }

  dropColumn(column: Column) {
    if (!this.draggedColumn || this.draggedColumn.parent !== column.parent
      || this.draggedColumn.getColumnId() === column.getColumnId()) {
      this.draggedColumn = null;
      return;
    }
    const columns = column.parent ? column.parent.columnDef.columns : this.columnDefs;
    let dragIndex = columns.indexOf(this.draggedColumn.columnDef);
    let dropIndex = columns.indexOf(column.columnDef);
    if (dropIndex >= columns.length) {
      dropIndex %= columns.length;
      dragIndex %= columns.length;
    }
    columns.splice(dropIndex, 0, columns.splice(dragIndex, 1)[0]);
    this.createColumns(this.columnDefs)
    this.draggedColumn = null;
  }

  getFormulas() {
    return Object.values(ColumnFormulaTypes);
  }

  changeFormula(column: Column, formula: string) {
    column.columnDef.formula = formula;
    column.columnDef.formulaResult = 0;
    let columnValue: number;
    let index = 0;
    for (const row of this.rows) {
      columnValue = ColumnHelper.getColumnValue(row.data, column.columnDef)
      if (this.isEmptyValue(columnValue)) {
        continue;
      }
      if (index === 0) {
        column.columnDef.formulaResult = +columnValue;
      }
      switch (formula) {
        case ColumnFormulaTypes.sum:
        case ColumnFormulaTypes.average:
          if (index !== 0) {
            column.columnDef.formulaResult += +columnValue;
          }
          break;
        case ColumnFormulaTypes.max:
          column.columnDef.formulaResult = Math.max(column.columnDef.formulaResult, columnValue);
          break;
        case ColumnFormulaTypes.min:
          column.columnDef.formulaResult = Math.min(column.columnDef.formulaResult, columnValue);
          break;
      }
      index++;
    }
    if (formula === ColumnFormulaTypes.average) {
      column.columnDef.formulaResult /= this.rows.length;
    }
  }

  private createRows() {
    this.rowsCache = [];
    this.createChildRows(this._originalData, null);
  }

  private createChildRows(children: T[], parent: Row<T>) {
    if (children) {
      for (const child of children) {
        const row = new Row<T>(child, parent);
        if (parent) {
          if (!parent.children) {
            parent.children = [];
          }
          parent.children.push(row);
        }
        this.rowsCache.push(row);
        this.createChildRows(child[this.options.nameRowChildrenProperty], row);
      }
    }
  }

  toggleCollapseRow(row: Row<T>) {
    row.collapsed = !row.collapsed;
    const index = this.rows.indexOf(row) + 1;
    if (row.collapsed) {
      this.rows.splice(index, this.getCountRowChildren(row))
    } else {
      this.rows.splice(index, 0, ...this.flatRowChildren(row))
    }
    this.rows = [...this.rows];
  }

  private getCountRowChildren(row: Row<T>): number {
    let count = row.children ? row.children.length : 0;
    if (row.children) {
      for (const child of row.children) {
        count += child.collapsed ? 0 : this.getCountRowChildren(child);
      }
    }
    return count;
  }

  private flatRowChildren(row: Row<T>): Row<T>[] {
    let rows: Row<T>[] = [];
    if (row.children && !row.collapsed) {
      for (const child of row.children) {
        rows.push(...[child], ...this.flatRowChildren(child));
      }
    }
    return rows;
  }

  toggleSelectAll() {
    for (const row of this.rows) {
      row.selected = this.selectedAll;
    }
  }

  toggleSelect(row: Row<T>) {
    row.selected = !row.selected
    this.selectChildren(row,row.selected);
    this.selectParent(row,row.selected);
  }

  private selectChildren(row:Row<T>,selected?:boolean){
    // if (children) {
    //   for (const child of children) {
    //     this.selectChildren(child.children,selected);
    //     child.selected = selected;
    //   }
    // }
  }

  private selectParent(row:Row<T>,selected?:boolean){
    // while (parent) {
    //   parent.selected = parent.children.filter(child => child.selected).length === parent.children.length;
    //   parent = parent.parent;
    // }
  }

  resetSelect() {
    this.selectedAll = false;
    for (const row of this.rows) {
      row.selected = false;
    }
  }
}
