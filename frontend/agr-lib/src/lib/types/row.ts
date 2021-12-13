export class Row<Type> {
  children?: Row<Type>[] = [];
  rowLevel?: number;
  selected?: boolean;
  collapsed?: boolean;

  constructor(public data: Type, public parent: Row<Type> = null) {
    this.rowLevel = parent?parent.rowLevel+1:0;
  }
}
