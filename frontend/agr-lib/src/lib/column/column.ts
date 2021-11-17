import { ColumnDef } from './column-def';

export class Column {
  hide?: boolean;
  columns?: Column[] = [];
  colSpan = 1;
  rowSpan = 1;
  width:string;
  collapsed: boolean;
  isLast:boolean;
  constructor(public columnDef: ColumnDef, public parent?: Column) {
    this.width = columnDef.width?(columnDef.width+'px'):'50px';
  }
  getColumnId(){
    return this.columnDef.id??this.columnDef.field;
  }
}
