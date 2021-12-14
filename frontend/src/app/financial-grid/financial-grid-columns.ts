import {ColumnDef, ColumnFilterTypes, ColumnTypes} from "agr-lib";


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
          title:'',
          field:'checkbox',
          width:32
        },
        {
          title: '#',
          field: 'index_number',
          width: 64,
          hideInCollapse: true,
        },
        {
          title: 'Name',
          field: 'firstName',
          width: 100,
          sortable: true,
          filterable: true,
          editable: true
        },
        {
          title: 'Last Name',
          field: 'lastName',
          width: 100,
          sortable: true,
          filterable: true,
          editable: true
        },
        {
          title: 'Account Type',
          field: 'accountType',
          width: 100,
          sortable: true,
          filterable: true,
          editable: true,
          getValue(row: any, index?: any): any {
            return row[this.field]?.accountType ?? '';
          }
        },
        {
          title: 'Account Number',
          field: 'accountNumber',
          editable: true,
          hideInCollapse: true,
          filterable: true,
          sortable: true
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
          editable: true
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
          sortable: true,
          filterable: true,
          editable: true,
          getValue(row: any, index?: any): any {
            return row[this.field]?.transactionType ?? '';
          }
        },
        {
          title: 'Transaction Date',
          field: 'transactionDate',
          width: 100,
          sortable: true,
          filterable: true,
          editable: true,
        },
        {
          title: 'Transaction Amount',
          field: 'transactionAmount',
          width: 100,
          type: ColumnTypes.number,
          filterType: ColumnFilterTypes.number,
          sortable: true,
          filterable: true,
          editable: true
        }
      ]
    }
  ]

}

