import {Component, Input, OnInit} from '@angular/core';
import {Column, ColumnHelper, ColumnTypes} from "agr-lib";

@Component({
  selector: 'agr-grid-cell',
  templateUrl: './grid-cell.component.html',
  styleUrls: ['./grid-cell.component.scss']
})
export class GridCellComponent implements OnInit {
  @Input() row:any;
  @Input() column:Column;
  columnHelper  = ColumnHelper;
  columnTypes = ColumnTypes
  constructor() { }

  ngOnInit(): void {
  }

}
