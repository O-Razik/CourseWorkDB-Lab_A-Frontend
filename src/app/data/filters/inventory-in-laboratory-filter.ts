export interface InventoryInLaboratoryFilter {
  fromDate?: Date;
  toDate?: Date;
  inventoryIds?: number[];
  laboratoryId?: number;
  search?: string;
}
