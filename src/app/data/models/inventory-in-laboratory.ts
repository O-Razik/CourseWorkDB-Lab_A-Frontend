import {Inventory} from './inventory';
import {City} from './city';

export interface InventoryInLaboratory {
  inventoryInLaboratoryId: number;
  expirationDate: string;
  quantity: number;
  inventoryId: number;
  laboratoryId: number;
  inventory: Inventory;
}
