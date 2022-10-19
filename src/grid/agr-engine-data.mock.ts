import { ColumnDef } from '../types/column-def';
import { ColumnFilterTypes } from '../types/column-filter.types';

export function getData() {
  return [
    {
      field1_1: 37,
      field1_2: 40,
      field1_3: new Date(2015, 1, 1),
      children: [
        {
          field2: 1,
          field3: 1,
        },
        {
          field2: 2,
          field3: 2,
        },
      ],
    },
    {
      field1_1: 50,
      field1_2: 60,
      field1_3: new Date(2018, 1, 1),
      children: [
        {
          field2: 3,
          field3: 4,
        },
        {
          field2: 5,
          field3: 6,
        },
      ],
    },
    { field1_1: 50, field1_2: 30, field1_3: new Date(2020, 1, 1) },
  ];
}

export function getColumnsDef(): ColumnDef[] {
  return [
    {
      title: '1',
      field: 'field1',
      columns: [
        {
          title: '1.1',
          field: 'field1_1',
          filterable: true,
          filterType: ColumnFilterTypes.number,
          collapsed: false,
          hideInCollapse: true,
        },
        {
          title: '1.2',
          field: 'field1_2',
          filterable: true,
          filterType: ColumnFilterTypes.number,
          collapsed: false,
          hideInCollapse: false,
        },
        {
          title: '1.3',
          field: 'field1_3',
          filterable: true,
          filterType: ColumnFilterTypes.date,
          columns: [
            {
              title: '1.3.1',
              field: 'field1_3_1',
            },
            {
              title: '1.3.2',
              field: 'field1_3_2',
            },
          ],
        },
      ],
    },
    {
      title: '2',
      field: 'field2',
    },
    {
      title: '3',
      field: 'field3',
    },
    {
      title: '4',
      field: 'field4',
      columns: [
        {
          title: '4.1',
          field: 'field4_1',
        },
        {
          title: '4.2',
          field: 'field4_2',
        },
        {
          title: '4.3',
          field: 'field4_3',
          columns: [
            {
              title: '4.3.1',
              field: 'field4_3_1',
            },
            {
              title: '4.3.2',
              field: 'field4_3_2',
            },
          ],
        },
      ],
    },
  ];
}
