import {Analysis} from "./analysis";

export interface OrderAnalysis {
  orderAnalysisId: number;
  analysisId: number;
  clientOrderId: number;
  analysis: Analysis;
}
