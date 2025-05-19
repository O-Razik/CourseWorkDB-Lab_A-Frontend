export interface AnalysisCenter {
  analysisCenterId: number;
  cityId: number;
  address: string;
  city: {
    cityId: number;
    cityName: string;
  };
}
