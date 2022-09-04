import {Component, Input, OnInit} from '@angular/core';
import {Column} from "agr-lib";
import {AgrGridFilterSortService} from "../agr-grid-filter-sort.service";

@Component({
  selector: 'agr-grid-footer',
  templateUrl: './grid-footer.component.html',
  styleUrls: ['./grid-footer.component.scss']
})
export class GridFooterComponent implements OnInit {
  @Input() column: Column;
  options: { label: string, value: string }[] = [];

  constructor(public filterSortService: AgrGridFilterSortService) {
  }

  ngOnInit(): void {
  }

  show(menu, $event) {
    this.options = this.filterSortService.getFormulas().map((item) =>
      ({
        label: item, value: item, command: (event) => {
          this.filterSortService.changeFormula(this.column, event.item.value)
        }
      }));
    menu.toggle($event);
  }
}
