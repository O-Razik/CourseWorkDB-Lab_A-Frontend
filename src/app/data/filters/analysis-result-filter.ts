export interface AnalysisResultFilter {
  fromDate?: Date;
  toDate?: Date;
  analysisCenterId?: number;
  analysisId?: number;
  clientFullname?: string;
  pageNumber: number;
  pageSize: number;
}
