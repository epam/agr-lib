import orderByExt from 'lodash-es/orderBy.js';

type SortFunction = (row) => void;
export interface SortObject {
  key: string | SortFunction;
  order?: 'asc' | 'desc';
}

type SortKey = string | SortObject;

export function orderBy(collection: any[], sortInfo: SortKey[]) {
  const properties = [];
  const orders = [];
  for (const sort of sortInfo) {
    if (typeof sort === 'string') {
      properties.push(sort);
      orders.push('asc');
    } else {
      properties.push(sort.key);
      orders.push(sort.order);
    }
  }
  return [];
  // return orderByExt(collection,properties,orders);
}
