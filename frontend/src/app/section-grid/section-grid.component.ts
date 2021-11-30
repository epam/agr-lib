import {ChangeDetectorRef, Component, NgZone, OnInit, ViewChild} from '@angular/core';
import {SectionGridService} from "./section-grid.service";
import {Column, ColumnHelper} from "agr-lib";
import {Table, TableService} from "primeng";

export function tableFactory(component: SectionGridComponent) {
  return component.primengTable;
}

@Component({
  selector: 'agr-section-grid',
  templateUrl: './section-grid.component.html',
  styleUrls: ['./section-grid.component.scss'],
  providers:[    {
    provide: Table,
    useFactory: tableFactory,
    deps: [SectionGridComponent]
  }]
})
export class SectionGridComponent implements OnInit {
  @ViewChild('primengTable', { static: true }) public primengTable: Table;
  frozenWidth = '0px';
  editValue = {
    value:''
  };
  constructor(public grid:SectionGridService,
              public cdr:ChangeDetectorRef,
              private zone:NgZone) { }

  ngOnInit(): void {
  }

  toggleCollapse(column: Column) {
    this.grid.gridEngine.toggleCollapse(column);
  }

  togglePin(column: Column) {
    this.grid.gridEngine.togglePin(column);
    this.frozenWidth = column.columnDef.pinned?'464px':'0px';
  }

  dragStartColumn(column: Column) {
    this.grid.gridEngine.dragStartColumn(column)
  }

  dropColumn(column: Column) {
    this.grid.gridEngine.dropColumn(column);
  }

  editInit($event: any) {
    this.editValue.value = ColumnHelper.getColumnValue($event.data,$event.field.columnDef)
  }

  editComplete($event: any) {
    this.grid.update($event.data,$event.field,this.editValue.value);
  }

  editCancel() {

  }
}
