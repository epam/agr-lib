import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import {Subject, Subscription} from 'rxjs';
import {debounceTime} from 'rxjs/operators';
import {ColumnSelectFilterData} from "agr-lib";

@Component({
  selector: 'agr-select-filter',
  templateUrl: './select-filter.component.html',
  styleUrls: ['./select-filter.component.scss']
})
export class SelectFilterComponent implements OnInit, OnChanges {
  @Input() data: ColumnSelectFilterData[];
  @Input() values:string[];
  @Output() changeFilter = new EventEmitter<ColumnSelectFilterData[]>();
  selectedAll =false;
  filterText = '';
  filteredOptions: {data:ColumnSelectFilterData,selected?:boolean}[] = [];
  private textStream = new Subject<string>();
  private subscription: Subscription;
  private wrappedData:{data:ColumnSelectFilterData,selected?:boolean}[];
  ngOnInit() {
    this.subscription = this.textStream.pipe(
      debounceTime(350),
    ).subscribe((text) => {
      this.filteredOptions = (this.wrappedData || []).filter((item) => {
        return text ? item.data.label.toLowerCase().indexOf(text.toLowerCase()) >= 0 : true;
      });
      this.calculateAll();
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    const data = this.data??[];
    const values = this.values??[];
    this.wrappedData = data.map(item=>{
      const wrap = {
        data:item,
        selected: values.some(value=>value===item.value)
      }
      return wrap;
    })
    this.textStream.next(this.filterText);
  }

  onSelectAll() {
    for (const option of this.filteredOptions) {
      option.selected = this.selectedAll;
    }
    this.emitSelected();
  }

  onSelect() {
    this.calculateAll();
    this.emitSelected();
  }

  private emitSelected(){
    this.changeFilter.emit(this.filteredOptions.filter(option => option.selected).map(option => option.data.value))
  }

  private calculateAll() {
    const selected = this.filteredOptions.filter(option => option.selected);
    this.selectedAll = selected.length > 0 && selected.length === this.filteredOptions.length;
  }

  changeText() {
    this.textStream.next(this.filterText);
  }
}
