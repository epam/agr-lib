import {AgrEngine} from "./agr-engine";
import {ColumnDef} from "../types/column-def";
import { expect } from 'chai';
import {ColumnFilterTypes} from "../types/column-filter.types";
function getData(){
  return [
    {field1_1:37,field1_2:40},
    {field1_1:50,field1_2:60},
    {field1_1:50,field1_2:30},
  ]
}
function getColumnsDef(): ColumnDef[] {
  return [
    {
      title:'1',
      field:'field1',
      columns:[
        {
          title:'1.1',
          field:'field1_1',
          filterable:true,
          filterType:ColumnFilterTypes.number,
        },
        {
          title:'1.2',
          field:'field1_2'
        },
        {
          title:'1.3',
          field:'field1_3',
          columns:[
            {
              title:'1.3.1',
              field:'field1_3_2'
            },
            {
              title:'1.3.2',
              field:'field1_3_2'
            },
          ]
        },
      ]
    },
    {
      title:'2',
      field:'field2'
    },
    {
      title:'3',
      field:'field3'
    },
    {
      title:'4',
      field:'field4',
      columns:[
        {
          title:'4.1',
          field:'field4_1'
        },
        {
          title:'4.2',
          field:'field4_2'
        },
        {
          title:'4.3',
          field:'field4_3',
          columns:[
            {
              title:'4.3.1',
              field:'field4_3_1'
            },
            {
              title:'4.3.2',
              field:'field4_3_2'
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
    grid.setColumnDefs(getColumnsDef());
    grid.data = getData();
  });
  it('Setting Defs',()=>{
    expect(grid.header[0][0].colSpan).to.equal(4);
    expect(grid.header[0][1].colSpan).to.equal(1);
    expect(grid.header[0][1].rowSpan).to.equal(3);
  })
  it('OR Group Filter',()=>{
    grid.switchFilter(grid.header[1][0],{
      condition:'OR_GROUP',
      value:{min:37,max:37}
    })
    grid.switchFilter(grid.header[1][1],{
      condition:'OR_GROUP',
      value:{min:30,max:30}
    })
    expect(grid.data.length).to.equal(2);
  })
})
