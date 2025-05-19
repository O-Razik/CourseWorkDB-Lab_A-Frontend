export interface InventoryOrderFilter {
  fromDate?: Date;
  toDate?: Date;
  supplierId?: number;
  minPrice?: number;
  maxPrice?: number;
  statusIds?: number[];
  pageNumber: number;
  pageSize: number;
  search?: string;
}

