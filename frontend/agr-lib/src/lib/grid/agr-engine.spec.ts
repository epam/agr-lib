import {AgrEngine} from "./agr-engine";
import {expect} from 'chai';
import {getColumnsDef, getData} from "./agr-engine-data.spec";

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
