import {Inventory} from "./inventory";
import {InventoryDelivery} from './inventory-delivery';

export interface InventoryInOrder {
  inventoryInOrderId: number;
  price: number;
  quantity: number;
  inventoryId: number;
  inventoryOrderId: number;
  orderNumber: number;
  inventory: Inventory;
  inventoryDeliveries: InventoryDelivery[];
}
