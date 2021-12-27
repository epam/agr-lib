import {Component, ViewChild} from '@angular/core';
import {OverlayPanel} from 'primeng';
import {AgrGridService} from "../agr-grid.service";
import {ColumnDef} from "agr-lib";

@Component({
  selector: 'agr-page-grid-filter',
  templateUrl: './page-grid-filter.component.html',
  styleUrls: ['./page-grid-filter.component.scss'],
})
export class PageGridFilterComponent {
  @ViewChild('overlay') overlay: OverlayPanel;
  constructor(public gridService: AgrGridService<unknown>) {
  }

  isArray(value) {
    return Array.isArray(value);
  }

  getFilters() {
    return this.gridService.gridEngine.filterColumnsData.values() ?? [];
  }

  resetFilters(){
    this.gridService.gridEngine.resetFilters();
    this.overlay.hide();
  }

  removeFilter(columnDef:ColumnDef){
    this.gridService.gridEngine.removeFilter(columnDef);
    if (this.gridService.gridEngine.filterColumnsData.size===0){
      this.overlay.hide();
    }

  }
}
