export interface EmployeeFilter {
  search?: string;
  laboratoryId?: number;
  positionIds?: number[];
  pageNumber: number;
  pageSize: number;
}
