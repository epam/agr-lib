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
          showFooter:true,
          getValue(row: any, index?: any): string {
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
          showFooter:true,
          getValue(row: any, index?: any): string {
            return row.temperature1400;
          }
        },
        {
          title: '18:00',
          field: 'tempIn18',
          width: 50,
          showFooter:true,
          getValue(row: any, index?: any): string {
            return row.temperature1800;
          }
        },
        {
          title: '21:00',
          field: 'tempIn21',
          width: 50,
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
              hideInCollapse:true,
              showFooter:true
            },
            {
              title: 'Diastolic',
              field: 'bloodPressureDiastolic0900',
              hideInCollapse:true,
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
              showFooter:true
            },
            {
              title: 'Diastolic',
              field: 'bloodPressureDiastolic1400',
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
              showFooter:true
            },
            {
              title: 'Diastolic',
              field: 'bloodPressureDiastolic1800',
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
              showFooter:true
            },
            {
              title: 'Diastolic',
              field: 'bloodPressureDiastolic2100',
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
          showFooter:true
        },
        {
          title: '14:00',
          field: 'pulse0900',
          showFooter:true
        },
        {
          title: '18:00',
          field: 'pulse0900',
          showFooter:true
        },
        {
          title: '21:00',
          field: 'pulse0900',
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
          showFooter:true
        },
        {
          title: 'WBC',
          field: 'wbc',
          showFooter:true
        },
        {
          title: 'MCV',
          field: 'mcv',
          showFooter:true
        },
        {
          title: 'PCV',
          field: 'pcv',
          showFooter:true
        },
        {
          title: 'RBC',
          field: 'rbc',
          showFooter:true
        },
        {
          title: 'MCH',
          field: 'mch',
          showFooter:true
        },
        {
          title: 'MCHC',
          field: 'mchc',
          showFooter:true
        },
        {
          title: 'RDW',
          field: 'rdw',
          showFooter:true
        },
        {
          title: 'Neutrophils',
          field: 'neutrophils',
          showFooter:true
        },
        {
          title: 'Lymphocytes',
          field: 'lymphocytes',
          showFooter:true
        },
        {
          title: 'Monocytes',
          field: 'monocytes',
          showFooter:true
        },
        {
          title: 'Eosinophils',
          field: 'eosinophils',
          showFooter:true
        },
        {
          title: 'Basophils',
          field: 'basophils',
          showFooter:true
        }
      ]
    }
  ]

}

