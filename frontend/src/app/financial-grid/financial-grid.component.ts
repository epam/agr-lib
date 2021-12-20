import {Component, OnInit, ViewChild} from '@angular/core';
import {FinancialGridService} from "./financial-grid.service";
import {Table,TableService} from "primeng";
import {Column, ColumnHelper} from "agr-lib";

export function tableFactory(component: FinancialGridComponent) {
  return component.primengTable;
}
@Component({
  selector: 'agr-financial-grid',
  templateUrl: './financial-grid.component.html',
  styleUrls: ['./financial-grid.component.scss'],
  providers: [{
    provide: Table,
    useFactory: tableFactory,
    deps: [FinancialGridComponent]
  }]
})
export class FinancialGridComponent implements OnInit {
  frozenWidth = '0px';
  editValue = {
    value:''
  };
  reference:any[] = [];
  @ViewChild('primengTable', { static: true }) public primengTable: Table;
  referenceLabel: string;

  constructor(public grid: FinancialGridService) {
  }

  ngOnInit(): void {
  }

  toggleCollapse(column: Column) {
    this.grid.gridEngine.toggleCollapse(column);
  }

  togglePin(column: Column) {
    this.grid.gridEngine.togglePin(column);
    this.frozenWidth = column.columnDef.pinned?'464px':'0px';
  }

  dragStartColumn(column: Column) {
    this.grid.gridEngine.dragStartColumn(column)
  }

  dropColumn(column: Column) {
    this.grid.gridEngine.dropColumn(column);
  }

  editInit($event: any) {
    switch ($event.field.columnDef.field){
      case 'accountType':
        this.reference = this.grid.accountTypes;
        this.referenceLabel = 'accountType';
        this.editValue.value = this.reference.find(item=>item.id == $event.data.data.accountType.id);
        break;
      case 'transactionType':
        this.reference = this.grid.transactionTypes;
        this.referenceLabel = 'transactionType';
        this.editValue.value = this.reference.find(item=>item.id == $event.data.data.transactionType.id);
        break;
      default:
        this.editValue.value = ColumnHelper.getColumnValue($event.data.data,$event.field.columnDef)
    }
  }

  editComplete($event: any) {
    this.grid.update($event.data,$event.field,this.editValue.value);
  }

  editCancel() {

  }

}
