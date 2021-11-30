import {Column} from './column';
import {ColumnDef} from './column-def';

export class ColumnHelper {
  static getColumnValue(data: unknown, columnDef: ColumnDef) {
    return columnDef.getValue ? columnDef.getValue(data) : data[columnDef.field];
  }

  static getColumnDisplayValue(data: unknown, columnDef: ColumnDef) {
    return columnDef.getDisplayValue ? columnDef.getDisplayValue(data) :
      ColumnHelper.getColumnValue(data, columnDef);
  }

  static setColumnValue(data:unknown,columnDef:ColumnDef,value:unknown){
    columnDef.setValue ? columnDef.setValue(data, value) : data[columnDef.field] = value;
  }

  // static createColumnsFromDef(columnsDef: ColumnDef[]): Column[] {
  //   const columns: Column[] = [];
  //   for (const columnDef of columnsDef) {
  //     columns.push(ColumnHelper.createColumn(columnDef));
  //   }
  //   return columns;
  // }
  //
  // static createColumn(columnDef: ColumnDef, parent?: Column): Column {
  //   return Array.isArray(columnDef.columns) && columnDef.columns.length > 0
  //     ? this.internalCreateColumnGroup(columnDef, parent)
  //     : this.internalCreateColumn(columnDef, parent);
  // }
  //
  // private static internalCreateColumn(columnDef: ColumnDef, parent?: Column): Column {
  //   return new Column(columnDef, parent);
  // }
  //
  // private static internalCreateColumnGroup(columnDef: ColumnDef, parent?: Column): Column {
  //   const group = new Column(columnDef, parent);
  //   group.columns = [];
  //   group.colSpan = 0;
  //   for (const childColumnDef of columnDef.columns) {
  //     const childColumn = this.createColumn(childColumnDef, group);
  //     group.columns.push(childColumn);
  //     group.colSpan += childColumn.colSpan;
  //   }
  //   return group;
  // }
  //
  // static setCollapseState(group: Column, collapsed: boolean, skipParentColSpan = false) {
  //   group.collapsed = collapsed;
  //   let colSpanDelta = 0;
  //   for (const childColumn of group.columns) {
  //     if (ColumnHelper.isGroupColumn(childColumn)) {
  //       const colSpanOld = childColumn.colSpan;
  //       ColumnHelper.setCollapseState(childColumn, collapsed, true);
  //       colSpanDelta += childColumn.colSpan - colSpanOld;
  //     } else {
  //       if (!childColumn.columnDef.collapsible || (collapsed && childColumn.hide) || !(collapsed || childColumn.hide)) {
  //         continue;
  //       }
  //       childColumn.hide = collapsed;
  //       collapsed ? colSpanDelta-- : colSpanDelta++;
  //     }
  //   }
  //   group.colSpan += colSpanDelta;
  //   if (group.colSpan === 0) {
  //     group.hide = true;
  //   }
  //   if (!skipParentColSpan) {
  //     let parent = group.parent;
  //     while (parent) {
  //       parent.colSpan += colSpanDelta;
  //       parent = parent.parent;
  //     }
  //   }
  // }
  //
  // static isGroupColumn(column: Column): boolean {
  //   return Array.isArray(column.columns) && column.columns.length > 0;
  // }
}
