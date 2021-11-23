import {Component, forwardRef, OnInit} from '@angular/core';
import {SectionGridService} from "../section-grid/section-grid.service";
import {AgrGridFilterSortService} from "../shared/grid/agr-grid-filter-sort.service";

@Component({
  selector: 'agr-section-grid-page',
  templateUrl: './section-grid-page.component.html',
  styleUrls: ['./section-grid-page.component.scss'],
  providers:[SectionGridService,
    {provide:AgrGridFilterSortService, useExisting:forwardRef(()=>SectionGridService)}]
})
export class SectionGridPageComponent implements OnInit {

  constructor(public gridService:SectionGridService) { }

  ngOnInit(): void {
    this.gridService.refresh();
  }

}
