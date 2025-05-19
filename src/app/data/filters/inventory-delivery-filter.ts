export interface InventoryDeliveryFilter {
  fromDate?: Date;
  toDate?: Date;
  laboratoryId?: number;
  statusIds?: number[];
  inventoryIds?: number[];
  pageNumber: number;
  pageSize: number;
  search?: string;
}
