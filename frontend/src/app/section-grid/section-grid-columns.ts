import {ColumnDef, ColumnFilterTypes} from "agr-lib";


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
          filterable:true
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
          hideInCollapse:true,
          filterType: ColumnFilterTypes.date,
          filterable: true
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
          width: 100
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
          field: 'tempIn9',
          width: 50,
          filterType:ColumnFilterTypes.number,
          filterable: true,
          step:0.1,
          getDisplayValue(row: any, index?: any): string {
            return row.temperature0900;
          }
        },
        {
          title: '14:00',
          field: 'tempIn14',
          width: 50,
          filterType:ColumnFilterTypes.number,
          filterable: true,
          step:0.1,
          getDisplayValue(row: any, index?: any): string {
            return row.temperature1400;
          }
        },
        {
          title: '18:00',
          field: 'tempIn18',
          width: 50,
          getDisplayValue(row: any, index?: any): string {
            return row.temperature1800;
          }
        },
        {
          title: '21:00',
          field: 'tempIn21',
          width: 50,
          getDisplayValue(row: any, index?: any): string {
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
              hideInCollapse:true
            },
            {
              title: 'Diastolic',
              field: 'bloodPressureDiastolic0900',
              hideInCollapse:true
            }
          ]
        },
        {
          title: '14:00',
          field: 'bIn14',
          columns: [
            {
              title: 'Systolic',
              field: 'bloodPressureSystolic1400'
            },
            {
              title: 'Diastolic',
              field: 'bloodPressureDiastolic1400'
            }
          ]
        },
        {
          title: '18:00',
          field: 'bIn18',
          columns: [
            {
              title: 'Systolic',
              field: 'bloodPressureSystolic1800'
            },
            {
              title: 'Diastolic',
              field: 'bloodPressureDiastolic1800'
            }
          ]
        },
        {
          title: '21:00',
          field: 'bIn21',
          columns: [
            {
              title: 'Systolic',
              field: 'bloodPressureSystolic2100'
            },
            {
              title: 'Diastolic',
              field: 'bloodPressureDiastolic2100'
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
          field: 'pulse0900'
        },
        {
          title: '14:00',
          field: 'pulse0900'
        },
        {
          title: '18:00',
          field: 'pulse0900'
        },
        {
          title: '21:00',
          field: 'pulse0900'
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
          width: 100
        },
        {
          title: 'WBC',
          field: 'wbc'
        },
        {
          title: 'MCV',
          field: 'mcv'
        },
        {
          title: 'PCV',
          field: 'pcv'
        },
        {
          title: 'RBC',
          field: 'rbc'
        },
        {
          title: 'MCH',
          field: 'mch'
        },
        {
          title: 'MCHC',
          field: 'mchc'
        },
        {
          title: 'RDW',
          field: 'rdw'
        },
        {
          title: 'Neutrophils',
          field: 'neutrophils'
        },
        {
          title: 'Lymphocytes',
          field: 'lymphocytes'
        },
        {
          title: 'Monocytes',
          field: 'monocytes'
        },
        {
          title: 'Eosinophils',
          field: 'eosinophils'
        },
        {
          title: 'Basophils',
          field: 'basophils'
        }
      ]
    }
  ]

}

