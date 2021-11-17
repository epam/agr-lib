import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {ColumnDateFilterData} from "agr-lib";

@Component({
  selector: 'agr-date-filter',
  templateUrl: './date-filter.component.html',
  styleUrls: ['./date-filter.component.scss']
})
export class DateFilterComponent implements OnChanges {
  @Input() data: ColumnDateFilterData;
  @Input() values: ColumnDateFilterData;
  @Output() changeFilter = new EventEmitter<ColumnDateFilterData>();
  dateRange=[];


  ngOnChanges(changes: SimpleChanges) {
    if (this.values){
      this.dateRange =[this.values.startDate,this.values.endDate];
    }
  }

  onDateChange() {
    console.log(this.dateRange);
    this.changeFilter.emit({
      startDate:this.dateRange[0],
      endDate:this.dateRange[1],
    })
  }


}
