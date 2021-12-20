import {ColumnDef} from "./column-def";
import {Row} from "./row";

export class CellData{
  row?:Row<unknown>;
  columnDef:ColumnDef;
}
