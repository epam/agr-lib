import { ColumnDef } from 'src/types/column-def';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
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

  it('getListFilterConditions method', () => {
    grid.options.sectionMode = true;

    const conditions = grid.getListFilterConditions();

    expect(conditions).toStrictEqual(['AND', 'OR', 'OR_GROUP']);
  });

  describe('removeFilter method', () => {
    it('should work properly when removing relevant filters', () => {
      vi.spyOn(grid, 'filter');
      grid.switchFilter(grid.header[1][0], {
        condition: 'OR_GROUP',
        value: { min: 37, max: 37 },
      });
      grid.removeFilter(grid.header[1][0], false);

      expect([...grid.filterColumnsData.values()]).toStrictEqual([]);
      expect(grid.filter).toHaveBeenCalled();
    });

    it('should not remove irrelevant filters', () => {
      vi.spyOn(grid, 'filter');
      grid.switchFilter(grid.header[1][0], {
        condition: 'OR_GROUP',
        value: { min: 37, max: 37 },
      });
      grid.switchFilter(grid.header[1][1], {
        condition: 'OR_GROUP',
        value: { min: 30, max: 30 },
      });
      const filterValues = [...grid.filterColumnsData.values()][0] as ColumnDef[];

      grid.removeFilter(grid.header[1][0], false);

      expect(filterValues.length).toBe(1);
      expect(filterValues[0].field).toBe('field1_2');
      expect(grid.filter).toHaveBeenCalled();
    });
  });

  it('getColumnFilterData method', () => {
    vi.spyOn(grid, 'getNumberFilterData');

    const columnFilterData = grid.getColumnFilterData(grid.header[1][0]);

    expect(grid.getNumberFilterData).toHaveBeenCalledWith(grid.header[1][0]);
    expect(columnFilterData).toStrictEqual({ min: 37, max: 50 });
  });

  it('getSelectFilterValues method', () => {
    const columnFilterData = grid.getSelectFilterValues(grid.header[1][0]);

    expect(columnFilterData[0]).toStrictEqual({ label: 37, value: 37 });
    expect(columnFilterData[1]).toStrictEqual({ label: 50, value: 50 });
  });

  it('resetFilters method', () => {
    vi.spyOn(grid, 'filter');
    grid.switchFilter(grid.header[1][0], {
      condition: 'OR_GROUP',
      value: { min: 37, max: 37 },
    });
    grid.resetFilters();

    expect([...grid.filterColumnsData.values()]).toStrictEqual([]);
    expect(grid.filter).toHaveBeenCalled();
  });

  describe('switchSort method', () => {
    it('should work properly when switching to descending order', () => {
      grid.addSort(grid.header[0][1], 'ASC', true);
      vi.spyOn(grid, 'addSort');

      grid.switchSort(grid.header[0][1], true);

      expect(grid.addSort).toHaveBeenCalledWith(grid.header[0][1], 'DESC', true);
      expect(grid.rows[1].data).toStrictEqual({ field2: 2, field3: 2 });
    });

    it('should work properly when switching to descending order', () => {
      grid.data = [
        {
          field1_1: 37,
          field1_2: 40,
          children: [
            {
              field2: 2,
              field3: 2,
            },
            {
              field2: 1,
              field3: 1,
            },
          ],
        },
        getData().slice(0, 1),
      ];
      grid.options.unSortColumn = false;
      grid.addSort(grid.header[0][1], 'DESC', true);
      vi.spyOn(grid, 'addSort');

      grid.switchSort(grid.header[0][1], true);

      expect(grid.addSort).toHaveBeenCalledWith(grid.header[0][1], 'ASC', true);
      expect(grid.rows[1].data).toStrictEqual({ field2: 1, field3: 1 });
    });
  });

  describe('toggleCollapse method', () => {
    afterEach(() => {
      grid.body.forEach((column) => (column.collapsed = false));
    });

    it('should work properly when column is hidden in collapse', () => {
      grid.toggleCollapse(grid.header[0][0]);

      expect(grid.body.length).toBe(9);
    });

    it('should work properly when column is shown in collapse', () => {
      grid.toggleCollapse(grid.header[0][1]);

      expect(grid.body.length).toBe(10);
    });
  });

  it('resetSort method', () => {
    grid.addSort(grid.header[0][1], 'DESC', true);

    grid.resetSort();

    expect(grid.header[0][1].columnDef.sort).toBe(null);
  });

  it('removeSort method', () => {
    grid.addSort(grid.header[0][1], 'DESC', true);
    vi.spyOn(grid, 'sort');

    grid.removeSort(grid.header[0][1]);

    expect(grid.header[0][1].columnDef.sort).toBe(null);
    expect(grid.sort).toHaveBeenCalled();
  });

  describe('addSort method', () => {
    let resetSort;

    beforeEach(() => {
      resetSort = vi.spyOn(grid, 'resetSort');
    });

    afterEach(() => {
      resetSort.mockReset();
    });

    it('should work properly with descending order and multiple=false', () => {
      grid.addSort(grid.header[0][1], 'DESC', false);

      expect(resetSort).toHaveBeenCalled();
      expect(grid.rows[1].data).toStrictEqual({ field2: 2, field3: 2 });
    });

    it('should work properly with ascending order and multiple=true', () => {
      grid.data = [
        {
          field1_1: 37,
          field1_2: 40,
          children: [
            {
              field2: 2,
              field3: 2,
            },
            {
              field2: 1,
              field3: 1,
            },
          ],
        },
        getData().slice(0, 1),
      ];

      grid.addSort(grid.header[0][1], 'ASC', true);

      expect(resetSort).not.toHaveBeenCalled();
      expect(grid.rows[1].data).toStrictEqual({ field2: 1, field3: 1 });
    });
  });
});
