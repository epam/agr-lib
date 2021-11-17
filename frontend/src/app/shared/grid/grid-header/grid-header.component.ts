import {Component, Input, OnInit} from '@angular/core';
import {
  Column,
  ColumnSortOrder,
  ColumnFilterTypes,
  ColumnSelectFilterData,
  ColumnDateFilterData,
  ColumnFilterDataType, ColumnFilterValueType
} from "agr-lib";
import {AgrGridFilterSortService} from "../agr-grid-filter-sort.service";
import {ColumnNumberFilterData} from "agr-lib/lib/column/column-filter.types";

@Component({
  selector: 'agr-grid-header',
  templateUrl: './grid-header.component.html',
  styleUrls: ['./grid-header.component.scss']
})
export class GridHeaderComponent implements OnInit {
  @Input() column: Column;
  ColumnSort = ColumnSortOrder;
  ColumnFilterTypes = ColumnFilterTypes;
  styleClass = 'agr-grid-header-overlay';
  filterData: ColumnSelectFilterData[]| ColumnNumberFilterData| ColumnDateFilterData;
  opened: boolean;
  conditions: { label: string, value: string }[];
  condition: any;

  constructor(public filterSortService: AgrGridFilterSortService) {
  }

  ngOnInit(): void {
    if (!this.column.columnDef.filterType || this.column.columnDef.filterType===ColumnFilterTypes.select) {
      this.styleClass+=' agr-select-filter';
    }
  }

  sort($event: MouseEvent) {
    this.filterSortService.switchSort(this.column, $event.shiftKey)
  }

  open() {
    this.opened = true;
    this.prepareFilter();
  }

  close() {
    this.opened = false;
  }

  changeFilter(filterValue: any) {
    console.log(filterValue)
    this.filterSortService.switchFilter(this.column, {value: filterValue, condition: this.condition.value});
  }

  changeLogic() {
    if (this.column.columnDef.filter) {
      this.filterSortService.switchFilter(this.column,
        {value: this.column.columnDef.filter.value, condition: this.condition.value});
    }
  }

  clearFilter() {
    this.filterSortService.removeFilter(this.column);
    this.prepareFilter();
  }

  prepareFilter() {
    const mapHash = {
      AND: 'AND',
      OR: 'OR',
      'OR_GROUP': 'OR(Group)'
    }
    this.conditions = this.filterSortService.getListFilterConditions().map((condition) => {
      const obj = {
        label: mapHash[condition],
        value: condition
      }
      return obj;
    });
    if (this.column.columnDef.filter) {
      this.condition = this.conditions
        .find((condition) => condition.value === this.column.columnDef.filter.condition)
    } else {
      this.condition = this.conditions.find((condition) => condition.value === 'AND');
    }
    this.filterData = this.filterSortService.getColumnFilterData(this.column);
    console.log(this.filterData);
  }

  asNumberData(filterData: ColumnFilterDataType):ColumnNumberFilterData {
    return (filterData as ColumnNumberFilterData)
  }
  asSelectData(filterData: ColumnFilterDataType):ColumnSelectFilterData[] {
    return (filterData as ColumnSelectFilterData[])
  }
  asDateData(filterData: ColumnFilterDataType):ColumnDateFilterData {
    return (filterData as ColumnDateFilterData)
  }

  asNumberValue(filterValue: ColumnFilterValueType):ColumnNumberFilterData {
    return (filterValue as ColumnNumberFilterData)
  }

  asDateValue(filterValue: ColumnFilterValueType):ColumnDateFilterData {
    return (filterValue as ColumnDateFilterData)
  }
}
