import {InventoryInLaboratory} from "./inventory-in-laboratory";
import {InventoryInOrder} from "./inventory-in-order";
import {Status} from "./status";

export interface InventoryDelivery {
  inventoryDeliveryId: number;
  quantity: number;
  deliveryDate: string | Date;
  statusId: number;
  inventoryInLaboratoryId: number;
  laboratoryFullAddress: string;
  inventoryInOrderId: number;
  expirationDate: string | Date;
  inventoryInLaboratory: InventoryInLaboratory;
  status: Status;
}
