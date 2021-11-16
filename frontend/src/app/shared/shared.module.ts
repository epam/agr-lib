import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FixTablePrimengDirective} from "./fix/fix-table-primeng.directive";
import {DragColumnDirective} from "./fix/drag-column.directive";
import {GridSectionHeaderComponent} from './grid/grid-section-header/grid-section-header.component';
import {GridHeaderComponent} from './grid/grid-header/grid-header.component';
import {SelectFilterComponent} from "./grid/filter/select-filter/select-filter.component";
import {FormsModule} from "@angular/forms";
import {OverlayPanelModule, PanelModule} from "primeng";
import {LibraryModule} from "./library.module";
import {NumberFilterComponent} from "./grid/filter/number-filter/number-filter.component";


@NgModule({
  declarations: [
    FixTablePrimengDirective,
    DragColumnDirective,
    GridSectionHeaderComponent,
    GridHeaderComponent,
    SelectFilterComponent,
    NumberFilterComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    LibraryModule
  ],
  exports: [
    FixTablePrimengDirective,
    DragColumnDirective,
    CommonModule,
    LibraryModule,
    GridSectionHeaderComponent,
    GridHeaderComponent,
    SelectFilterComponent,
    NumberFilterComponent
  ]
})
export class SharedModule {
}
