import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {GroupGridComponent} from "./group-grid/group-grid.component";
import {SectionGridPageComponent} from "./section-grid-page/section-grid-page.component";

const routes: Routes = [
  {
    path:'',
    component:SectionGridPageComponent
  },
  {
    path:'group-grid',
    component:GroupGridComponent
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
