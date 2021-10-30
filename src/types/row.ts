export class Row<T> {
  children?: Row<T>[] = [];
  rowLevel?: number;
  selected?: boolean;
  collapsed?: boolean;
  filteredChildren?: Row<T> [] = []

  constructor(public data?: T, public parent: Row<T>|null=null) {
    this.rowLevel = this.parent ? this.parent.rowLevel + 1 : 0;
  }

  clearChildren(){
    this.children = [];
  }

  addChild(row:Row<T>){
    this.children.push(row);
  }

  addToFilteredChildren(){
    if (this.parent){
      this.parent.filteredChildren.push(this);
    }
  }

  removeFromFilteredChildren(){
    if (this.parent){
      this.parent.filteredChildren.splice(this.parent.filteredChildren.indexOf(this),1);
    }
  }

}
