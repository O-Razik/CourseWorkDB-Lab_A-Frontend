import {Status} from './status';
import {Supplier} from './supplier';
import {InventoryInOrder} from './inventory-in-order';

export interface InventoryOrder {
  inventoryOrderId: number;
  number: number;
  supplierId: number;
  statusId: number;
  fullprice: number;
  orderDate: string | Date;
  inventoryInOrders: InventoryInOrder[];
  status: Status;
  supplier: Supplier;
}

