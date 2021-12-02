import {ColumnDef, ColumnFilterTypes, ColumnTypes} from "agr-lib";


export function SectionGridColumnDefs(): ColumnDef[] {
  return [
    {
      title: 'Identity',
      field: 'identity_group',
      collapsible: true,
      pin:true,
      dragDisabled:true,
      columns: [
        {
          title: '#',
          field: 'index_number',
          width: 64,
          hideInCollapse:true,
        },
        {
          title: 'Name',
          field: 'firstName',
          width: 100,
          sortable:true,
          filterable:true,
          editable:true
        },
        {
          title: 'Last Name',
          field: 'lastName',
          width: 100,
        },
        {
          title: 'Birth Date',
          field: 'birthDate',
          width: 100,
          type:ColumnTypes.date,
          editable: true,
          hideInCollapse:true,
          filterType: ColumnFilterTypes.date,
          filterable: true,
          getValue(row: any, index?: any): any {
            return new Date(Date.parse(row[this.field]));
          }
        },
        {
          title: 'National ID',
          field: 'nationalID',
          width: 50,
          // getValue(row: any, index?: any): any {
          //   row.nationalID;
          // }
        },
        {
          title: 'Measurement Date',
          field: 'measurementDate',
          type:ColumnTypes.date,
          editable: true,
          hideInCollapse:true,
          filterType: ColumnFilterTypes.date,
          filterable: true,
          width: 100,
          getValue(row: any, index?: any): any {
            return new Date(Date.parse(row[this.field]));
          },
        },
      ],
    },
    {
      title: 'Location',
      field: 'location_group',
      collapsible:true,
      columns: [
        {
          title: 'Country',
          field: 'country',
          width: 100
        },
        {
          title: 'State/Province',
          field: 'state',
          width: 100
        },
        {
          title: 'City',
          field: 'city',
          width: 100
        },
        {
          title: 'Address',
          field: 'address',
          width: 100
        },
      ]
    },
    {
      title: 'Temperature',
      field: 'temperature_section',
      columns: [
        {
          title: '9:00',
          field: 'temperature0900',
          width: 50,
          type:ColumnTypes.number,
          editable: true,
          filterType:ColumnFilterTypes.number,
          filterable: true,
          step:0.1,
          showFooter:true,
          getValue(row: any, index?: any): string {
            return row.temperature0900;
          }
        },
        {
          title: '14:00',
          field: 'temperature1400',
          width: 50,
          type:ColumnTypes.number,
          filterType:ColumnFilterTypes.number,
          filterable: true,
          step:0.1,
          showFooter:true,
          getValue(row: any, index?: any): string {
            return row.temperature1400;
          }
        },
        {
          title: '18:00',
          field: 'temperature1800',
          width: 50,
          type:ColumnTypes.number,
          showFooter:true,
          getValue(row: any, index?: any): string {
            return row.temperature1800;
          }
        },
        {
          title: '21:00',
          field: 'temperature2100',
          width: 50,
          type:ColumnTypes.number,
          showFooter:true,
          getValue(row: any, index?: any): string {
            return row.temperature2100;
          }
        },
      ]
    },
    {
      title: 'Blood pressure',
      field: 'section_blood',
      collapsible:true,
      columns: [
        {
          title: '9:00',
          field: 'bIn9',
          collapsible:true,
          columns: [
            {
              title: 'Systolic',
              field: 'bloodPressureSystolic0900',
              type:ColumnTypes.number,
              hideInCollapse:true,
              showFooter:true
            },
            {
              title: 'Diastolic',
              field: 'bloodPressureDiastolic0900',
              type:ColumnTypes.number,
              showFooter:true
            }
          ]
        },
        {
          title: '14:00',
          field: 'bIn14',
          columns: [
            {
              title: 'Systolic',
              field: 'bloodPressureSystolic1400',
              type:ColumnTypes.number,
              showFooter:true
            },
            {
              title: 'Diastolic',
              field: 'bloodPressureDiastolic1400',
              type:ColumnTypes.number,
              showFooter:true
            }
          ]
        },
        {
          title: '18:00',
          field: 'bIn18',
          columns: [
            {
              title: 'Systolic',
              field: 'bloodPressureSystolic1800',
              type:ColumnTypes.number,
              showFooter:true
            },
            {
              title: 'Diastolic',
              field: 'bloodPressureDiastolic1800',
              type:ColumnTypes.number,
              showFooter:true
            }
          ]
        },
        {
          title: '21:00',
          field: 'bIn21',
          columns: [
            {
              title: 'Systolic',
              field: 'bloodPressureSystolic2100',
              type:ColumnTypes.number,
              showFooter:true
            },
            {
              title: 'Diastolic',
              field: 'bloodPressureDiastolic2100',
              type:ColumnTypes.number,
              showFooter:true
            }
          ]
        }
      ]
    },
    {
      title: 'Pulse',
      field: 'section_pulse',
      columns: [
        {
          title: '9:00',
          field: 'pulse0900',
          type:ColumnTypes.number,
          showFooter:true
        },
        {
          title: '14:00',
          field: 'pulse1400',
          type:ColumnTypes.number,
          showFooter:true
        },
        {
          title: '18:00',
          field: 'pulse1800',
          type:ColumnTypes.number,
          showFooter:true
        },
        {
          title: '21:00',
          field: 'pulse2100',
          type:ColumnTypes.number,
          showFooter:true
        }
      ]
    },
    {
      title:'Complete Blood Count',
      field:'section',
      columns:[
        {
          title: 'Hemoglobin',
          field: 'hemoglobin',
          width: 100,
          type:ColumnTypes.number,
          showFooter:true
        },
        {
          title: 'WBC',
          field: 'wbc',
          type:ColumnTypes.number,
          showFooter:true
        },
        {
          title: 'MCV',
          field: 'mcv',
          type:ColumnTypes.number,
          showFooter:true
        },
        {
          title: 'PCV',
          field: 'pcv',
          type:ColumnTypes.number,
          showFooter:true
        },
        {
          title: 'RBC',
          field: 'rbc',
          type:ColumnTypes.number,
          showFooter:true
        },
        {
          title: 'MCH',
          field: 'mch',
          type:ColumnTypes.number,
          showFooter:true
        },
        {
          title: 'MCHC',
          field: 'mchc',
          type:ColumnTypes.number,
          showFooter:true
        },
        {
          title: 'RDW',
          field: 'rdw',
          type:ColumnTypes.number,
          showFooter:true
        },
        {
          title: 'Neutrophils',
          field: 'neutrophils',
          type:ColumnTypes.number,
          showFooter:true
        },
        {
          title: 'Lymphocytes',
          field: 'lymphocytes',
          type:ColumnTypes.number,
          showFooter:true
        },
        {
          title: 'Monocytes',
          field: 'monocytes',
          type:ColumnTypes.number,
          showFooter:true
        },
        {
          title: 'Eosinophils',
          field: 'eosinophils',
          type:ColumnTypes.number,
          showFooter:true
        },
        {
          title: 'Basophils',
          field: 'basophils',
          type:ColumnTypes.number,
          showFooter:true
        }
      ]
    }
  ]

}

