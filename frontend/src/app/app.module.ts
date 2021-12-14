import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {SectionGridComponent} from './section-grid/section-grid.component';
import {GroupGridComponent} from './group-grid/group-grid.component';
import {SharedModule} from "./shared/shared.module";
import { SectionGridPageComponent } from './section-grid-page/section-grid-page.component';
import {OverlayPanelModule, PanelModule, TableModule} from "primeng";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {HttpClientModule} from "@angular/common/http";
import { FinancialPageComponent } from './financial-page/financial-page.component';
import { FinancialGridComponent } from './financial-grid/financial-grid.component';
import {FormsModule} from "@angular/forms";

@NgModule({
  declarations: [
    AppComponent,
    SectionGridComponent,
    GroupGridComponent,
    SectionGridPageComponent,
    FinancialPageComponent,
    FinancialGridComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    SharedModule,
    TableModule,
    PanelModule,
    OverlayPanelModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
