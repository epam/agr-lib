import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {ColumnNumberFilterData} from "agr-lib";

@Component({
  selector: 'agr-number-filter',
  templateUrl: './number-filter.component.html',
  styleUrls: ['./number-filter.component.scss']
})
export class NumberFilterComponent implements OnChanges {
  @Input() data: ColumnNumberFilterData;
  @Input() values: ColumnNumberFilterData;
  @Input() step:number;
  @Output() changeFilter = new EventEmitter<ColumnNumberFilterData>();
  range = [];

  ngOnChanges(changes: SimpleChanges) {
    this.range = this.values? [this.values.min,this.values.max]:[this.data?.min,this.data?.max]
  }


  onChange() {
    setTimeout(() => {
      if (this.range[0] < this.data.min) {
        this.range[0] = this.data.min;
      }
      if (this.range[1] > this.data.max) {
        this.range[1] = this.data.max;
      }
      this.range = [...this.range];
      const result:ColumnNumberFilterData = this.range[0] !== this.data.min || this.range[1] !== this.data.max ?
        {min:this.range[0],max:this.range[1]}:null;
      this.changeFilter.emit(result);
    });
  }
}
