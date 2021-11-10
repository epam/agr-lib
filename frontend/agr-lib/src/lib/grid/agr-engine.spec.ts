import {AgrEngine} from "./agr-engine";
import {ColumnDef} from "../column/column-def";
import { expect } from 'chai';


function getColumnsDef(): ColumnDef[] {
  return [
    {
      title:'1',
      field:'1',
      columns:[
        {
          title:'1.1',
          field:'1.1'
        },
        {
          title:'1.2',
          field:'1.2'
        },
        {
          title:'1.3',
          field:'1.3',
          columns:[
            {
              title:'1.3.1',
              field:'1.3.2'
            },
            {
              title:'1.3.2',
              field:'1.3.2'
            },
          ]
        },
      ]
    },
    {
      title:'2',
      field:'3'
    },
    {
      title:'3',
      field:'3'
    },
    {
      title:'4',
      field:'4',
      columns:[
        {
          title:'4.1',
          field:'4.1'
        },
        {
          title:'4.2',
          field:'4.2'
        },
        {
          title:'4.3',
          field:'4.3',
          columns:[
            {
              title:'4.3.1',
              field:'4.3.1'
            },
            {
              title:'4.3.2',
              field:'4.3.2'
            },
          ]
        },
      ]
    },
  ]
}
describe('Agr Engine', () => {
  let grid: AgrEngine<unknown>;
  beforeEach(() => {
    grid = new AgrEngine<unknown>([]);
  });
  it('Setting Defs',()=>{
    grid.setColumnDefs(getColumnsDef());
    expect(grid.header[0][0].colSpan).to.equal(4);
    expect(grid.header[0][1].colSpan).to.equal(1);
    expect(grid.header[0][1].rowSpan).to.equal(3);
  })
})
