export interface ClientOrderFilter {
  pageNumber: number;
  pageSize: number;
  fromDate?: Date;
  toDate?: Date;
  employeeId?: number;
  clientFullname?: string;
  minPrice: number;
  maxPrice: number;
  statusIds?: number[];
}

