import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {SectionGridPageComponent} from "./section-grid-page/section-grid-page.component";
import {FinancialPageComponent} from "./financial-page/financial-page.component";

const routes: Routes = [
  {
    path:'',
    component:SectionGridPageComponent
  },
  {
    path:'group-grid',
    component:FinancialPageComponent
  },
  {
    path:'**',
    redirectTo:'/',
    pathMatch:'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
