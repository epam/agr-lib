import {CellData, ColumnDef, ColumnFilterTypes, ColumnTypes} from "agr-lib";
import {formatDate} from "@angular/common";


export function financialGridColumnDefs(): ColumnDef[] {
  return [
    {
      title: 'Identity & Accounts',
      field: 'identityAccounts',
      collapsible: true,
      pin: true,
      dragDisabled: true,
      columns: [
        {
          title: '',
          field: 'checkbox',
          width: 32,
          skipExport: true
        },
        {
          title: '#',
          field: 'index_number',
          width: 64,
          hideInCollapse: true,
          skipExport: true
        },
        {
          title: 'Name',
          field: 'firstName',
          width: 100,
          sortable: true,
          filterable: true,
          editable: 'byRowLevel',
          rowLevel: [0]
        },
        {
          title: 'Last Name',
          field: 'lastName',
          width: 100,
          sortable: true,
          filterable: true,
          editable: 'byRowLevel',
          rowLevel: [0]
        },
        {
          title: 'Account Type',
          field: 'accountType',
          width: 100,
          type: ColumnTypes.reference,
          sortable: true,
          filterable: true,
          editable: 'byRowLevel',
          rowLevel: [1],
          getDisplayValue(row: any, index?: any): any {
            return row[this.field]?.accountType ?? '';
          }
        },
        {
          title: 'Account Number',
          field: 'accountNumber',
          editable: 'byRowLevel',
          hideInCollapse: true,
          filterable: true,
          sortable: true,
          rowLevel: [1]
        },
        {
          title: 'Interest Rate',
          field: 'rate',
          editable: 'byRowLevel',
          type: ColumnTypes.number,
          filterType: ColumnFilterTypes.number,
          hideInCollapse: true,
          filterable: true,
          sortable: true,
          rowLevel: [1],
          getDisplayValue(row: any, index?: any): string {
            const value = this.getValue(row, index);
            return value ? `${value}%` : '';
          },
          getValue(row: any, index?: any): any {
            return isNaN(row[this.field]) ? '' : parseFloat(row[this.field]);
          }
        },
        {
          title: 'Balance',
          field: 'balance',
          width: 100,
          type: ColumnTypes.number,
          filterType: ColumnFilterTypes.number,
          step: 0.01,
          sortable: true,
          filterable: true,
          editable: 'byRowLevel',
          rowLevel: [1],
          getValue(row: any, index?: any): any {
            return isNaN(row[this.field]) ? '' : parseFloat(row[this.field]);
          }
        },
      ],
    },
    {
      title: 'Transactions History',
      field: 'transactionsHistory',
      collapsible: true,
      columns: [
        {
          title: 'Transaction Name',
          field: 'transactionType',
          width: 100,
          type:'reference',
          sortable: true,
          filterable: true,
          editable: 'byRowLevel',
          rowLevel: 2,
          getValue(row: any, index?: any): any {
            return row[this.field]?.transactionType ?? '';
          }
        },
        {
          title: 'Transaction Date',
          field: 'transactionDate',
          width: 100,
          type: ColumnTypes.date,
          filterType: ColumnFilterTypes.date,
          sortable: true,
          filterable: true,
          editable: 'byRowLevel',
          rowLevel: 2,
          getDisplayValue(row: any, index?: any): string {
            const date = this.getValue(row, index);
            return date ? formatDate(date, 'dd MMM yyy', 'en_US') : ''
          },
          getValue(row: any, index?: any): any {
            return row[this.field] ? new Date(Date.parse(row[this.field])) : '';
          }
        },
        {
          title: 'Transaction Amount',
          field: 'transactionAmount',
          width: 100,
          type: ColumnTypes.number,
          filterType: ColumnFilterTypes.number,
          sortable: true,
          filterable: true,
          editable: 'byRowLevel',
          rowLevel: 2,
          getValue(row: any, index?: any): any {
            return isNaN(row[this.field]) ? '' : parseFloat(row[this.field]);
          }
        }
      ]
    }
  ]

}

