import {ChangeDetectorRef, Component, NgZone, OnInit} from '@angular/core';
import {SectionGridService} from "./section-grid.service";
import {Column} from "agr-lib";

@Component({
  selector: 'agr-section-grid',
  templateUrl: './section-grid.component.html',
  styleUrls: ['./section-grid.component.scss'],
  // providers:[]
})
export class SectionGridComponent implements OnInit {
  frozenWidth = '0px';

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
}
