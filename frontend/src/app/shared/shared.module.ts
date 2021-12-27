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
import {DateFilterComponent} from "./grid/filter/date-filter/date-filter.component";
import {GridFooterComponent} from './grid/grid-footer/grid-footer.component';
import {GridCellComponent} from './grid/grid-cell/grid-cell.component';
import {GridCellEditorComponent} from './grid/grid-cell-editor/grid-cell-editor.component';
import {AppProgressSpinnerComponent} from './app-progress-spinner/app-progress-spinner.component';
import {PageGridFilterComponent} from "./grid/page-grid-filter/page-grid-filter.component";


@NgModule({
  declarations: [
    FixTablePrimengDirective,
    DragColumnDirective,
    GridSectionHeaderComponent,
    GridHeaderComponent,
    SelectFilterComponent,
    NumberFilterComponent,
    DateFilterComponent,
    GridFooterComponent,
    GridCellComponent,
    GridCellEditorComponent,
    AppProgressSpinnerComponent,
    PageGridFilterComponent
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
    NumberFilterComponent,
    DateFilterComponent,
    GridFooterComponent,
    GridCellComponent,
    GridCellEditorComponent,
    AppProgressSpinnerComponent,
    PageGridFilterComponent

  ]
})
export class SharedModule {
}
