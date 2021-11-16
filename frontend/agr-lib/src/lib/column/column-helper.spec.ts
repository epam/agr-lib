import { Column } from './column';
import { ColumnHelper } from './column-helper';
import { expect } from 'chai';
import { ColumnDef } from './column-def';


function getColumnsDef(): ColumnDef[] {
  return [
    {
      title: 'Section1',
      field: 'section1',
      columns: [
        {
          title: 'Section1_Column1',
          field: 'section1_column1',
          collapsible: true,
        },
        {
          title: 'Section1_Column2',
          field: 'section1_column2',
          columns: [
            {
              title: 'section1_Column2_1',
              field: 'section1_column2_1',
            },
            {
              title: 'Section1_Column2_2',
              field: 'section1_column2_2',
            },
            {
              title: 'Section1_Column2_3',
              field: 'section1_column2_3',
              columns: [
                {
                  title: 'Section1_Column2_3_1',
                  field: 'section1_column2_3_1',
                },
                {
                  title: 'Section1_Column2_3_1',
                  field: 'section1_column2_3_2',
                  collapsible: true,
                },
              ],
            },
          ],
        },
        {
          title: 'Section1_Column3',
          field: 'section1_column3',
        },
      ],
    },
    {
      title: 'Section2',
      field: 'section2',
      columns: [
        {
          title: 'Section2_Column1',
          field: 'section2_column1',
        },
        {
          title: 'Column2',
          field: 'section2_column2',
        },
        {
          title: 'Section2_Column3',
          field: 'section2_column3',
        },
      ],
    },
  ];
}

describe('ColumnHelper', () => {
  let columns: Column[];
  beforeEach(() => {
    columns = ColumnHelper.createColumnsFromDef(getColumnsDef());
  });
  describe('Definition', () => {
    it('ColumnDef to Column', () => {
      expect(columns[0].columnDef.field).equal('section1');
      expect(columns[0].colSpan).equal(6);
      expect(columns[0].columns[1].columns.length).equal(3);
      expect(columns[0].columns[1].columns[0].columnDef.field).equal('section1_column2_1');
      expect(columns[0].columns[1].columns[0].parent).equal(columns[0].columns[1]);
      expect(columns[0].columns[1].colSpan).equal(4);
    });
  });

  describe('Collapse/Expand', () => {
    it('Collapse/Expand', () => {
      //Collapse root group
      ColumnHelper.setCollapseState(columns[0], true);
      //Check root colSpan
      expect(columns[0].colSpan).equal(4);
      //Check child colSpan
      expect(columns[0].columns[1].colSpan).equal(3);

      //Expand root group
      ColumnHelper.setCollapseState(columns[0], false);
      expect(columns[0].colSpan).equal(6);
      expect(columns[0].columns[1].colSpan).equal(4);

      //Collapse child group only
      ColumnHelper.setCollapseState(columns[0].columns[1].columns[2], true);
      expect(columns[0].columns[1].colSpan).equal(3);
      ColumnHelper.setCollapseState(columns[0].columns[1].columns[2], false);
      expect(columns[0].columns[1].colSpan).equal(4);
      columns[0].columns[1].columns[2].columns[0].columnDef.collapsible = true;
      ColumnHelper.setCollapseState(columns[0].columns[1].columns[2], true);
      expect(columns[0].columns[1].colSpan).equal(2);
    });
  });
});
