//@ts-nocheck
import { AfterViewInit, Directive } from '@angular/core';
import { Table } from 'primeng';
import { DomHandler } from 'primeng/dom';

@Directive({
  selector: '[aqrFixTablePrimeng]'
})
export class FixTablePrimengDirective implements AfterViewInit{

  constructor(private table: Table) {
    this.table.onColumnResizeEnd = this.onColumnResizeEnd.bind(this);
    this.table.setScrollableItemsWidthOnExpandResize = this.setScrollableItemsWidthOnExpandResize.bind(this);
  }

  ngAfterViewInit() {
    const viewportScrollable = document.getElementsByTagName('cdk-virtual-scroll-viewport');
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < viewportScrollable.length; i++) {
      if (!viewportScrollable[i].classList.contains('ui-table-scrollable-body')) {
        viewportScrollable[i].classList.add('ui-table-scrollable-body');
      }
    }
  }
  // We copied logic from  PrimeNG and fix calculation index of column
  // In PrimeNg index was calculated wrong if we have 3 level column header
  onColumnResizeEnd(event, column) {
    let delta = this.table.resizeHelperViewChild.nativeElement.offsetLeft - this.table.lastResizerHelperX;
    const columnWidth = column.offsetWidth;
    const minWidth = parseInt(column.style.minWidth || 15, 10);

    if (columnWidth + delta < minWidth) {
      delta = minWidth - columnWidth;
    }

    const newColumnWidth = columnWidth + delta;

    if (newColumnWidth >= minWidth) {
      if (this.table.columnResizeMode === 'fit') {
        let nextColumn = column.nextElementSibling;
        const colspan = nextColumn.colSpan || 0;
        while (!nextColumn.offsetParent) {
          nextColumn = nextColumn.nextElementSibling;
        }

        if (nextColumn) {
          const nextColumnWidth = nextColumn.offsetWidth - delta;
          const nextColumnMinWidth = nextColumn.style.minWidth || 15;

          if (newColumnWidth > 15 && nextColumnWidth > parseInt(nextColumnMinWidth, 10)) {
            if (this.table.scrollable) {
              const scrollableView = this.table.findParentScrollableView(column);
              const scrollableBodyTable = DomHandler.findSingle(scrollableView, '.ui-table-scrollable-body table');
              const scrollableHeaderTable = DomHandler.findSingle(scrollableView, 'table.ui-table-scrollable-header-table');
              const scrollableFooterTable = DomHandler.findSingle(scrollableView, 'table.ui-table-scrollable-footer-table');
              const resizeColumnIndex = this.indexColumn(column);

              this.resizeColGroup(scrollableHeaderTable, resizeColumnIndex, newColumnWidth, delta, this.table.columnResizeMode);
              this.resizeColGroup(scrollableBodyTable, resizeColumnIndex, newColumnWidth, delta, this.table.columnResizeMode);
              this.resizeColGroup(scrollableFooterTable, resizeColumnIndex, newColumnWidth, delta, this.table.columnResizeMode);
            } else {
              column.style.width = newColumnWidth + 'px';
              if (nextColumn) {
                nextColumn.style.width = nextColumnWidth + 'px';
              }
            }
          }
        }
      } else if (this.table.columnResizeMode === 'expand') {
        if (newColumnWidth >= minWidth) {
          if (this.table.scrollable) {
            this.setScrollableItemsWidthOnExpandResize(column, newColumnWidth, delta);
          } else {
            // this.table.tableViewChild.nativeElement.style.width = this.table.tableViewChild.nativeElement.offsetWidth + delta + 'px';
            column.style.width = newColumnWidth + 'px';
            // const containerWidth = this.table.tableViewChild.nativeElement.style.width;
            // this.table.containerViewChild.nativeElement.style.width = containerWidth + 'px';
          }
        }
      }

      this.table.onColResize.emit({
        element: column,
        delta
      });

      if (this.table.isStateful()) {
        this.table.saveState();
      }
    }

    this.table.resizeHelperViewChild.nativeElement.style.display = 'none';
    DomHandler.removeClass(this.table.containerViewChild.nativeElement, 'p-unselectable-text');
  }

  setScrollableItemsWidthOnExpandResize(column, newColumnWidth, delta) {
    const scrollableView = column ? this.table.findParentScrollableView(column) : this.table.containerViewChild.nativeElement;
    const scrollableBody = DomHandler.findSingle(scrollableView, '.ui-table-scrollable-body');
    const scrollableHeader = DomHandler.findSingle(scrollableView, '.ui-table-scrollable-header');
    const scrollableFooter = DomHandler.findSingle(scrollableView, '.ui-table-scrollable-footer');
    const scrollableBodyTable = DomHandler.findSingle(scrollableBody, '.ui-table-scrollable-body table');
    const scrollableHeaderTable = DomHandler.findSingle(scrollableHeader, 'table.ui-table-scrollable-header-table');
    const scrollableFooterTable = DomHandler.findSingle(scrollableFooter, 'table.ui-table-scrollable-footer-table');

    const scrollableBodyTableWidth = column ? scrollableBodyTable.offsetWidth + delta : newColumnWidth;
    const scrollableHeaderTableWidth = column ? scrollableHeaderTable.offsetWidth + delta : newColumnWidth;
    const isContainerInViewport = this.table.containerViewChild.nativeElement.offsetWidth >= scrollableBodyTableWidth;

    const setWidth = (container, table, width, isContainerInViewport) => {
      if (container && table) {
        container.style.width = isContainerInViewport ? width + DomHandler.calculateScrollbarWidth(scrollableBody) + 'px' : 'auto';
        table.style.width = width + 'px';
      }
    };

    // setWidth(scrollableBody, scrollableBodyTable, scrollableBodyTableWidth, isContainerInViewport);
    // setWidth(scrollableHeader, scrollableHeaderTable, scrollableHeaderTableWidth, isContainerInViewport);
    // setWidth(scrollableFooter, scrollableFooterTable, scrollableHeaderTableWidth, isContainerInViewport);

    if (column) {
      const resizeColumnIndex = this.indexColumn(column);

      this.resizeColGroup(scrollableHeaderTable, resizeColumnIndex, newColumnWidth, delta, 'expand');
      this.resizeColGroup(scrollableBodyTable, resizeColumnIndex, newColumnWidth, delta, 'expand');
      this.resizeColGroup(scrollableFooterTable, resizeColumnIndex, newColumnWidth, delta, 'expand');
    }
  }

  indexColumn(element: any) {
    const table = [];
    const rows = element.closest('thead').rows;
    for (let rIndex = 0; rIndex < rows.length; rIndex++) {
      const cells = rows[rIndex].cells;
      // tslint:disable-next-line:prefer-for-of
      for (let cIndex = 0; cIndex < cells.length; cIndex++) {
        const cell = cells[cIndex];
        const colSpan = cell.colSpan || 1;
        const rowSpan = cell.rowSpan || 1;
        let colIndexSkip = -1;
        table[rIndex] = table[rIndex] || [];
        for (let mColIndex = 0; mColIndex <= table[rIndex].length && colIndexSkip === -1; mColIndex++) {
          if (!table[rIndex][mColIndex] && table[rIndex][mColIndex] !== 0) {
            colIndexSkip = mColIndex;
          }
        }
        for (let mRowIndex = rIndex; mRowIndex < rIndex + rowSpan; mRowIndex++) {
          table[mRowIndex] = table[mRowIndex] || [];
          let colIndex;
          for (let mColIndex = colIndexSkip; mColIndex < colIndexSkip + colSpan; mColIndex++) {
            table[mRowIndex][mColIndex] = mColIndex;
            colIndex = mColIndex;
          }
          if (cell === element) {
            return colIndex;
          }
        }
      }
    }
  }

  resizeColGroup(table, resizeColumnIndex, newColumnWidth, delta, mode = 'fit') {
    if (table) {
      const colGroup = table.children[0].nodeName === 'COLGROUP' ? table.children[0] : null;

      if (colGroup) {
        const col = colGroup.children[resizeColumnIndex];
        const nextCol = colGroup.children[resizeColumnIndex + 1];
        col.style.width = (parseInt(col.style.width, 10) + delta) + 'px';

        if (nextCol && mode === 'fit') {
          nextCol.style.width = (parseInt(nextCol.style.width, 10) - delta) + 'px';
        }
      } else {
        throw new Error('Scrollable tables require a colgroup to support resizable columns');
      }
    }
  }


}
