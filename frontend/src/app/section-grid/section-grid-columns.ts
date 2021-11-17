import {ColumnDef, ColumnFilterTypes} from "agr-lib";


export function SectionGridColumnDefs(): ColumnDef[] {
  return [
    {
      title: 'Identity',
      field: 'identity_group',
      collapsible: true,
      data:{
        isSection:true
      },
      columns: [
        {
          title: '#',
          field: 'index_number',
          width: 64,
          hideInCollapse:true
        },
        {
          title: 'Name',
          field: 'firstName',
          width: 100,
          sortable:true,
          filterable:true,
        },
        {
          title: 'Last Name',
          field: 'lastName',
          width: 100
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
          field: 'nationalId',
          width: 50
        },
        {
          title: 'Date',
          field: 'date',
          width: 50
        },
      ],
    },
    {
      title: 'Location',
      field: 'location_group',
      columns: [
        {
          title: 'Country',
          field: 'country',
          width: 100
        },
        {
          title: 'State/Province',
          field: 'state-province',
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
          step:0.1
        },
        {
          title: '14:00',
          field: 'in14',
          width: 50
        },
        {
          title: '18:00',
          field: 'in18',
          width: 50
        }, {
          title: '21:00',
          field: 'in21',
          width: 50
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
              field: 'bIn9S',
              hideInCollapse:true
            },
            {
              title: 'Diastolic',
              field: 'bIn9D',
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
              field: 'bIn14S'
            },
            {
              title: 'Diastolic',
              field: 'bIn14D'
            }
          ]
        },
        {
          title: '18:00',
          field: 'bIn18',
          columns: [
            {
              title: 'Systolic',
              field: 'bIn18S'
            },
            {
              title: 'Diastolic',
              field: 'bIn18D'
            }
          ]
        },
        {
          title: '21:00',
          field: 'bIn21',
          columns: [
            {
              title: 'Systolic',
              field: 'bIn21S'
            },
            {
              title: 'Diastolic',
              field: 'bIn21D'
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
          field: 'pIn9'
        },
        {
          title: '14:00',
          field: 'pIn14'
        },
        {
          title: '18:00',
          field: 'pIn18'
        },
        {
          title: '21:00',
          field: 'pIn21'
        }
      ]
    },
    {
      title:'Complete Blood Count',
      field:'section',
      columns:[
        {
          title: 'Hemoglobin',
          field: 'hemoglobin'
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
          field: 'neytrophils'
        },
        {
          title: 'Lymphocytes',
          field: 'Lymphocytes'
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

