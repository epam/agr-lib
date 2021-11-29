import {Component, Input, OnInit} from '@angular/core';
import {Column, ColumnHelper, ColumnTypes} from "agr-lib";

@Component({
  selector: 'agr-grid-cell-editor',
  templateUrl: './grid-cell-editor.component.html',
  styleUrls: ['./grid-cell-editor.component.scss']
})
export class GridCellEditorComponent implements OnInit {
  @Input() row: unknown;
  @Input() column: Column;
  @Input() value:any;
  columnTypes=ColumnTypes;
  constructor() {
  }

  ngOnInit(): void {
    // this.value = ColumnHelper.getColumnValue(this.row,this.column.columnDef);
  }

}
