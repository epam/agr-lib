import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {
  Column,
  ColumnSortOrder,
  ColumnFilterTypes,
  ColumnSelectFilterData,
  ColumnNumberFilterData,
  ColumnDateFilterData,
  ColumnFilterDataType, ColumnFilterValueType
} from "agr-lib";
import {AgrGridFilterSortService} from "../agr-grid-filter-sort.service";

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
  showEmpty: boolean;

  constructor(public filterSortService: AgrGridFilterSortService,
              private cdr:ChangeDetectorRef) {
  }

  ngOnInit(): void {
    if (!this.column.columnDef.filterType || this.column.columnDef.filterType===ColumnFilterTypes.select) {
      this.styleClass+=' agr-select-filter';
    }
  }

  sort($event: MouseEvent) {
    this.filterSortService.switchSort(this.column, $event.shiftKey);
  }

  open() {
    this.opened = true;
    this.prepareFilter();
  }

  close() {
    this.opened = false;
  }

  changeFilter(filterValue: any) {
    this.filterSortService.switchFilter(this.column,
      {value: filterValue, condition: this.condition.value, showEmpty:this.showEmpty});
  }

  changeFilterExtra() {
    if (this.column.columnDef.filter) {
      this.changeFilter(this.column.columnDef.filter.value);
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
      return  {
        label: mapHash[condition],
        value: condition
      };
    });
    if (this.column.columnDef.filter) {
      this.condition = this.conditions
        .find((condition) => condition.value === this.column.columnDef.filter.condition);
      this.showEmpty = this.column.columnDef.filter.showEmpty;
    } else {
      this.condition = this.conditions.find((condition) => condition.value === 'AND');
      this.showEmpty = false;
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

  asSelectValue(filterValue: ColumnFilterValueType):string[] {
    return (filterValue as string[])
  }

}
