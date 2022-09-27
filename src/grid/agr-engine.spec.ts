import { beforeEach, describe, expect, it } from 'vitest';
import { AgrEngine } from './agr-engine';
import { getColumnsDef, getData } from './agr-engine-data.mock';

describe('Agr Engine', () => {
  let grid: AgrEngine<unknown>;
  beforeEach(() => {
    grid = new AgrEngine<unknown>([]);
    grid.setColumnDefs(getColumnsDef());
    grid.data = getData();
  });
  it('Setting Defs', () => {
    expect(grid.header[0][0].colSpan).toBe(4);
    expect(grid.header[0][1].colSpan).toBe(1);
    expect(grid.header[0][1].rowSpan).toBe(3);
  });
  it('OR Group Filter', () => {
    grid.switchFilter(grid.header[1][0], {
      condition: 'OR_GROUP',
      value: { min: 37, max: 37 },
    });
    grid.switchFilter(grid.header[1][1], {
      condition: 'OR_GROUP',
      value: { min: 30, max: 30 },
    });
    const parentRows = grid.rows.filter((row) => row.rowLevel === 0);

    expect(grid.rows.length).toBe(4);
    expect(parentRows.length).toBe(2);
  });
});
