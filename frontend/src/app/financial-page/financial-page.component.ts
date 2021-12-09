import {Component, forwardRef, OnInit} from '@angular/core';
import {AgrGridFilterSortService} from "../shared/grid/agr-grid-filter-sort.service";
import {FinancialGridService} from "../financial-grid/financial-grid.service";

@Component({
  selector: 'agr-financial-page',
  templateUrl: './financial-page.component.html',
  styleUrls: ['./financial-page.component.scss'],
  providers:[FinancialGridService,
    {provide:AgrGridFilterSortService, useExisting:forwardRef(()=>FinancialGridService)}]
})
export class FinancialPageComponent implements OnInit {

  constructor(public financialGridService:FinancialGridService) { }

  ngOnInit(): void {
    this.financialGridService.refresh();
  }

}
