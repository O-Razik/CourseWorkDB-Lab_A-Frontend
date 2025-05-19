export interface BiomaterialDeliveryFilter {
  pageNumber: number;
  pageSize: number;
  analysisCenterId?: number;
  fromDate?: Date;
  toDate?: Date;
  statusId?: number;
}
