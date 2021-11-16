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
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';
import {ColumnSelectFilterValue} from "agr-lib";

@Component({
  selector: 'agr-select-filter',
  templateUrl: './select-filter.component.html',
  styleUrls: ['./select-filter.component.scss']
})
export class SelectFilterComponent implements OnInit, OnChanges {
  @Input() data: any[] = [];
  @Input() values: ColumnSelectFilterValue[];
  @Output() selected = new EventEmitter<ColumnSelectFilterValue[]>();
  selectedAll =false;
  filterText = '';
  filteredOptions: ColumnSelectFilterValue[] = [];
  private textStream = new Subject<string>();
  private subscription: Subscription;

  ngOnInit() {
    this.subscription = this.textStream.pipe(
      debounceTime(350),
    ).subscribe((text) => {
      this.filteredOptions = (this.values || []).filter((item) => {
        if (!item.label && text) {
          return false;
        }
        return text ? item.label.toLowerCase().indexOf(text.toLowerCase()) >= 0 : true;
      });
      this.calculateAll();
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (Array.isArray(this.values)) {
      this.textStream.next(this.filterText);
    }
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
    this.selected.emit(this.filteredOptions.filter(option => option.selected).map(option => option.value))
  }

  private calculateAll() {
    const selected = this.filteredOptions.filter(option => option.selected);
    this.selectedAll = selected.length > 0 && selected.length === this.filteredOptions.length;
  }

  changeText() {
    this.textStream.next(this.filterText);
  }
}
