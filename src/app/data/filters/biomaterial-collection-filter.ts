export interface BiomaterialCollectionFilter {
  pageNumber: number;
  pageSize: number;
  laboratoryId?: number;
  fromExpirationDate?: Date;
  toExpirationDate?: Date;
  fromCollectionDate?: Date;
  toCollectionDate?: Date;
  inventoryId?: number;
  biomaterialId?: number;
  search?: string;
}

