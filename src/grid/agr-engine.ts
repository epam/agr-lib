import orderBy from 'lodash-es/orderBy.js';
import sortBy from 'lodash-es/sortBy.js';
import cloneDeep from 'lodash-es/cloneDeep.js';
import { ColumnDef } from '../types/column-def';
import { Column } from '../types/column';
import { ColumnFormulaTypes, ColumnSortOrder, ColumnSortOrderType, ColumnTypes } from '../types/column.types';
import {
  ColumnDateFilterData,
  ColumnFilter,
  ColumnFilterDataType,
  ColumnFilterTypes,
  ColumnNumberFilterData,
  ColumnSelectFilterData,
} from '../types/column-filter.types';
import { ColumnHelper } from '../types/column-helper';
import { Row } from '../types/row';
import Big from 'big.js';

interface ColumnStack {
  column: Column;
  parent?: Column;
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
  private rowsTreeCache: Row<T>[] = [];
  frozenHeader: Column[][] = [];
  frozenBody: Column[] = [];
  _originalData: T[] = [];
  options: AgrEngineOptions;
  private sortColumnsData = new Map<string, ColumnDef>();
  filterColumnsData = new Map<string, ColumnDef | ColumnDef[]>();
  private draggedColumn: Column;
  private originalColumnDefs: ColumnDef[];
  selectedAll: boolean;
  private xlsx;

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
        nameRowParentProperty: 'row',
      },
      ...options,
    };
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
    this.frozenHeader = [];
    this.frozenBody = [];
    let header = [];
    let body = [];
    let stack: ColumnStack[] = columnsDefinition.map((columnDef) => {
      return {
        column: new Column(columnDef, null),
        rowIndex: 0,
        collapsed: columnDef.collapsed,
        pinned: columnDef.pinned,
      };
    });
    let count = 0;
    while (stack.length > 0) {
      if (count++ > 1000) {
        return;
      }
      let current = stack[0];
      if ((header.length === 0 && current.rowIndex === 0) || header.length < current.rowIndex + 1) {
        header.push([]);
      }
      if (Array.isArray(current.column.columnDef.columns) && current.column.columnDef.columns.length > 0 && !current.visited) {
        current.visited = true;
        current.column.colSpan = 0;
        const newStack = current.column.columnDef.columns
          .filter((columnDef) => {
            let collapsed = current.collapsed || columnDef.collapsed;
            return collapsed ? this.isVisibleInCollapse(columnDef) : true;
          })
          .map((columnDef) => {
            const column = new Column(columnDef, current.column);
            current.column.columns.push(column);
            return {
              column,
              rowIndex: current.rowIndex + 1,
              collapsed: current.collapsed || columnDef.collapsed,
              pinned: current.pinned || columnDef.pinned,
            };
          });
        stack = [...newStack, ...stack];
        continue;
      }
      current = stack.shift();
      header[current.rowIndex].push(current);
      if (!Array.isArray(current.column.columns) || current.column.columns.length === 0) {
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
        columnStack.pinned
          ? this.frozenHeader[columnStack.rowIndex].push(columnStack.column)
          : this.header[columnStack.rowIndex].push(columnStack.column);
      }
      const helperColumn = new Column({ title: 'r', field: 'r' });
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
    return !columnDef.hideInCollapse;
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
        break;
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
    const rootRow = new Row<T>();
    rootRow.filteredChildren = this.rows.filter((row) => row.rowLevel === 0);
    this.rows = [];
    this.sortChildren(rootRow);
  }

  sortChildren(row: Row<T>) {
    const sorts = [];
    const orders = [];
    if (Array.isArray(row.filteredChildren) && row.filteredChildren.length > 0) {
      for (const columnDef of this.sortColumnsData.values()) {
        if (!this.processRowByLevel(row.filteredChildren[0], columnDef)) {
          continue;
        }
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
    }
    const orderedRows = sorts.length > 0 ? orderBy(row.filteredChildren, sorts, orders) : row.filteredChildren;
    for (const orderRow of orderedRows) {
      this.rows.push(orderRow);
      this.sortChildren(orderRow);
    }
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
  removeFilter(column: Column | ColumnDef, skipFilter = false) {
    const columnDef = column instanceof Column ? column.columnDef : column;
    let columnId = ColumnHelper.getColumnId(columnDef);
    if (this.filterColumnsData.has(columnId)) {
      this.filterColumnsData.delete(columnId);
      columnDef.filter = null;
    } else {
      for (const [key, filterDef] of [...this.filterColumnsData.entries()]) {
        if (Array.isArray(filterDef)) {
          let index = 0;
          let found = false;
          for (const columnDefFilter of filterDef) {
            if (ColumnHelper.getColumnId(columnDef) === ColumnHelper.getColumnId(columnDefFilter)) {
              filterDef.splice(index, 1)[0].filter = null;
              if (filterDef.length === 0) {
                this.filterColumnsData.delete(key);
              }
              found = true;
              break;
            }
            index++;
          }
          if (found) {
            break;
          }
        }
      }
    }
    if (!skipFilter) {
      this.filter();
    }
  }

  //TODO Test
  resetFilters() {
    for (const filterValue of [...this.filterColumnsData.values()]) {
      const columnDefArr = Array.isArray(filterValue) ? filterValue : [filterValue];
      for (const columnDef of columnDefArr) {
        columnDef.filter = null;
      }
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
          value: value,
        });
      }
    }
    return sortBy([...mapValues.values()], 'label');
  }

  getNumberFilterData(column: Column): ColumnNumberFilterData {
    let filterData: ColumnNumberFilterData;
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
            max: value,
          };
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
    let filterData: ColumnDateFilterData;
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
            endDate: value,
          };
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
    this.rows = [...this.rowsCache];
    this.rows = this.rows.filter((row) => {
      let logicResult = true;
      let wasReInit = false;
      row.filteredChildren = [];
      for (const columnDef of this.filterColumnsData.values()) {
        if (Array.isArray(columnDef)) {
          let groupLogicResult = false;
          if (!wasReInit) {
            logicResult = true;
            wasReInit = true;
          }
          for (const childColumnDef of columnDef) {
            groupLogicResult ||=
              this.filterByColumn(childColumnDef, row) ||
              this.filterChild((row as any).children, childColumnDef) ||
              this.filterParent(row, childColumnDef);
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
              logicResult ||=
                this.filterByColumn(columnDef, row) ||
                this.filterChild((row as any).children, columnDef) ||
                this.filterParent(row, columnDef);
              break;
            default:
              logicResult &&=
                this.filterByColumn(columnDef, row) ||
                this.filterChild((row as any).children, columnDef) ||
                this.filterParent(row, columnDef);
          }
        }
      }
      if (logicResult && !this.isCollapsedParent(row)) {
        row.addToFilteredChildren();
        return true;
      }
      return false;
    });
    this.sort();
    this.recalculateSelected();
  }

  protected filterByColumn(columnDef: ColumnDef, row: Row<T>): boolean {
    if (!this.processRowByLevel(row, columnDef)) {
      return false;
    }
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
          columnResult = this.filterSelectColumn(value, columnDef.filter.value as string[]);
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
    return valueAsDate.getTime() >= filterAsDate.startDate.getTime() && valueAsDate.getTime() <= filterAsDate.endDate.getTime();
  }

  /* eslint-disable @typescript-eslint/no-unused-vars */
  protected filterCustomColumn(values: any[], filterValue: any): boolean {
    //It's stub for overriding custom filter in children
    return true;
  }

  private isCollapsedParent(row: Row<T>): boolean {
    let parent = row.parent;
    while (parent) {
      if (parent.collapsed) {
        return true;
      }
      parent = parent.parent;
    }
    return false;
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
    if (!this.draggedColumn || this.draggedColumn.parent !== column.parent || this.draggedColumn.getColumnId() === column.getColumnId()) {
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
    this.createColumns(this.columnDefs);
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
      if (!this.processRowByLevel(row, column.columnDef)) {
        continue;
      }
      columnValue = ColumnHelper.getColumnValue(row.data, column.columnDef);
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
            column.columnDef.formulaResult = this.precisionSum(column.columnDef.formulaResult, columnValue);
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

  private precisionSum(a: number, b: number) {
    return Big(a).plus(b).toNumber();
  }

  private createRows() {
    this.rowsCache = [];
    this.rowsTreeCache = [];
    this.createChildRows(this._originalData, null);
    // console.log(this.rowsCache);
  }

  private createChildRows(children: T[], parent: Row<T>) {
    if (children) {
      if (parent) {
        parent.clearChildren();
      }
      for (const child of children) {
        const row = new Row<T>(child, parent);
        if (parent) {
          parent.addChild(row);
        } else {
          this.rowsTreeCache.push(row);
        }
        this.rowsCache.push(row);
        this.createChildRows(child[this.options.nameRowChildrenProperty], row);
      }
    }
  }

  toggleCollapseRow(row: Row<T>) {
    row.collapsed = !row.collapsed;
    this.filter();
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
    if (row.filteredChildren && !row.collapsed) {
      for (const child of row.filteredChildren) {
        rows.push(child, ...this.flatRowChildren(child));
      }
    }
    return rows;
  }

  toggleSelectAll() {
    this.setSelectedAll(!this.selectedAll);
  }

  toggleSelect(row: Row<T>) {
    this.setSelect(row, !row.selected);
  }

  setSelect(row: Row<T>, selected?: boolean) {
    row.selected = selected;
    this.selectChildren(row, selected);
    this.selectParent(row, selected);
    this.recalculateSelectedAll();
  }

  private selectChildren(row: Row<T>, selected?: boolean) {
    if (row.filteredChildren) {
      for (const child of row.filteredChildren) {
        this.selectChildren(child, selected);
        child.selected = selected;
      }
    }
  }

  private selectParent(row: Row<T>, selected?: boolean) {
    let parent = row.parent;
    while (parent) {
      parent.selected = parent.filteredChildren.filter((child) => child.selected).length === parent.filteredChildren.length;
      parent = parent.parent;
    }
  }

  resetSelect() {
    this.setSelectedAll(false);
  }

  setSelectedAll(selected: boolean) {
    this.selectedAll = selected;
    for (const row of this.rows) {
      row.selected = this.selectedAll;
    }
  }

  private recalculateSelected() {
    for (const row of this.rows) {
      if (row.filteredChildren.length !== 0) {
        continue;
      }
      this.selectParent(row, row.selected);
    }
    this.recalculateSelectedAll();
  }

  private recalculateSelectedAll() {
    this.selectedAll = this.rows.filter((row) => row.selected).length === this.rows.length;
  }

  async exportToExcel(filename: string) {
    const xlsData = [];
    const xlsx = await import('xlsx');
    this.xlsx = xlsx;
    const worksheet = xlsx.utils.json_to_sheet([]);
    if (!worksheet['!merges']) {
      worksheet['!merges'] = [];
    }
    const header = this.prepareHeaderExcel(worksheet, this.header[0], 0, 0);
    for (const row of this.rows) {
      const xslRow = [];
      for (const column of this.body) {
        if (column.columnDef.skipExport) {
          continue;
        }
        xslRow.push(ColumnHelper.getColumnValue(row.data, column.columnDef));
      }
      xlsData.push(xslRow);
    }
    xlsx.utils.sheet_add_aoa(worksheet, xlsData, { origin: { c: 0, r: header.maxRow + 1 } });
    const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
    xlsx.writeFile(workbook, filename);
  }

  prepareHeaderExcel(worksheet, children: Column[], r: number, c: number) {
    let maxRow = r;
    let parentColSpan = 0;
    for (const child of children) {
      if (child.columnDef.skipExport) {
        continue;
      }
      let colSpan = child.colSpan > 1 ? child.colSpan : 1;
      const rowSpan = child.rowSpan > 1 ? child.rowSpan : 1;
      parentColSpan += colSpan;
      this.xlsx.utils.sheet_add_aoa(worksheet, [[child.columnDef.title]], { origin: { c, r }, skipHeader: true });
      if (Array.isArray(child.columns) && child.columns.length > 0) {
        const result = this.prepareHeaderExcel(worksheet, child.columns, r + 1, c);
        maxRow = Math.max(maxRow, result.maxRow);
        colSpan = result.parentColSpan;
      }
      if (colSpan > 1 || rowSpan > 1) {
        worksheet['!merges'].push({ s: { r, c }, e: { r: r + rowSpan - 1, c: c + colSpan - 1 } });
      }
      c = c + colSpan;
    }
    return {
      maxRow,
      parentColSpan,
    };
  }

  private processRowByLevel(row: Row<T>, columnDef: ColumnDef): boolean {
    if (!columnDef.rowLevel) {
      return true;
    }
    const rowLevel = Array.isArray(columnDef.rowLevel) ? columnDef.rowLevel : [columnDef.rowLevel];
    return rowLevel.includes(row.rowLevel);
  }

  editableColumn(column: Column, row: Row<T>) {
    if (typeof column.columnDef.editable === 'function') {
      return column.columnDef.editable.apply(null, [{ columnDef: column.columnDef, row }]);
    }
    if (column.columnDef.editable === 'byRowLevel') {
      const rowLevels = Array.isArray(column.columnDef.rowLevel) ? column.columnDef.rowLevel : [column.columnDef.rowLevel];
      return rowLevels.includes(row.rowLevel);
    }

    return column.columnDef.editable;
  }
}
