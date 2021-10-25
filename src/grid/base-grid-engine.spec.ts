import { expect } from 'chai';
import { BaseGridEngine } from './base-grid-engine';
import { columns, data } from './test/test.data.spec';
import { GridNumberFilterValues, GridSelectFilterValue, GridSortOrder } from './grid.types';
import { ColumnFilterLogic } from '../column/column.types';

describe('BaseGridEngine', () => {
  let gridEngine: BaseGridEngine<any>;
  const filter = {
    column: columns[1],
    data: [],
  };

  before(() => {
    gridEngine = new BaseGridEngine<any>();
    gridEngine.data = data;
  });

  describe('Get/Set Value', () => {
    it('Test getValue', () => {
      expect(gridEngine.getColumnValue(data[0], columns[0])).to.equal('rawValue');
    });
    it('Test getValue', () => {
      expect(gridEngine.getColumnValue(data[0], columns[1])).to.equal('getValue');
    });
    it('Test getDisplayValue', () => {
      expect(gridEngine.getColumnDisplayValue(data[0], columns[1])).to.equal('displayValue');
    });
  });

  describe('Filter', () => {
    it('Add Filter', () => {
      gridEngine.addFilter(filter);
      expect(gridEngine.filters.get(filter.column.field)).to.equal(filter);
    });

    it('Remove filter', () => {
      gridEngine.removeFilter(filter.column);
      expect(gridEngine.filters.get(filter.column.field)).not.exist;
    });

    it('Clear Filter', () => {
      gridEngine.addFilter(filter);
      gridEngine.resetFilter();
      expect(gridEngine.filters.size).to.equal(0);
    });
    // it('Update Filter', () => {
    //   gridEngine.addFilter(filter);
    //   gridEngine.addFilter({...filter, ...{value: [1]}});
    //   expect(gridEngine.filters.get(filter.column.field).value, 'Update filter is wrong').to.equal(1);
    // });
    it('Add Select Filter', () => {
      gridEngine.addFilter({
        data: ['rawValue', 'rawValue1'],
        column: columns[0],
        logic: ColumnFilterLogic.AND,
      });
      expect(gridEngine.data.length).to.equal(2);
    });
    it('Add Select Filter[Array]', () => {
      gridEngine.resetFilter();
      gridEngine.addFilter({
        data: ['a', 'c'],
        column: columns[3],
        logic: ColumnFilterLogic.AND,
      });
      expect(gridEngine.data.length).to.equal(3);
    });
    it('Add Number Filter', () => {
      gridEngine.addFilter({
        data: {
          min: 0,
          max: 0,
        },
        column: columns[2],
        logic: ColumnFilterLogic.AND,
      });
      expect(gridEngine.data.length).to.equal(1);
    });
    it('Add Date Filter', () => {
      gridEngine.resetFilter();
      gridEngine.addFilter({
        data: {
          startDate: '2020-01-30',
          endDate: '2020-02-05',
        },
        column: columns[5],
        logic: ColumnFilterLogic.AND,
      });
      expect(gridEngine.data.length).to.equal(2);
    });
    it('Add Date Filter(With empty values)', () => {
      gridEngine.resetFilter();
      gridEngine.addFilter({
        data: {
          startDate: '2020-01-30',
          endDate: '2020-02-05',
          showEmpty: true,
        },
        column: columns[5],
        logic: ColumnFilterLogic.AND,
      });
      expect(gridEngine.data.length).to.equal(3);
    });
  });

  describe('Filter Values', () => {
    describe('"Select" filter', () => {
      it('Min one', () => {
        expect((gridEngine.getColumnFilterValues(columns[0]) as GridSelectFilterValue[]).length).to.be.greaterThan(
          0,
          'Array of values have to contain one record with empty value and label'
        );
      });
      it('Filter Hide Empty', () => {
        const isEmpty = (gridEngine.getColumnFilterValues(columns[4]) as GridSelectFilterValue[]).filter((item) => !item.value).length;
        expect(isEmpty).to.be.equal(0, "Array of values havent't ");
      });
      // it('Right values ',()=>{
      //   const values = gridEngine.getSelectFilterValues(columns[0]).map(item=>item.value);
      //   expect(values).to.have.ordered.members(['','rawValue','rawValue2'],'Filter should ordered alphabetically')
      // })
    });
    describe('Number Filter', () => {
      it('Min value', () => {
        expect((gridEngine.getColumnFilterValues(columns[2]) as GridNumberFilterValues).min, 'Min is wrong').to.equal(0);
      });
      it('Max value', () => {
        expect((gridEngine.getColumnFilterValues(columns[2]) as GridNumberFilterValues).max, 'Max is wrong').to.equal(2);
      });
    });
  });

  describe('Sort', () => {
    it('Add sort', () => {
      const sort = {
        column: columns[0],
        direction: GridSortOrder.asc,
      };
      gridEngine.addSort(sort);
      expect(gridEngine.sorts.get(columns[0].field)).to.equal(sort);
    });
    it('Add multiple sort', () => {
      const sort = {
        column: columns[1],
        direction: GridSortOrder.asc,
      };
      gridEngine.addSort(sort, true);
      expect(gridEngine.sorts.size).to.equal(2);
    });
    it('Remove sort', () => {
      gridEngine.removeSort(columns[0]);
      expect(gridEngine.sorts.size).to.equal(1);
    });
    it('Reset sort', () => {
      gridEngine.resetSort();
      expect(gridEngine.sorts.size).to.equal(0);
    });
  });
});
