import {Analysis} from "./analysis";
import {AnalysisResult} from './analysis-result';

export interface OrderAnalysis {
  orderAnalysisId: number;
  analysisId: number;
  clientOrderId: number;
  analysis: Analysis;
  analysisResults?: AnalysisResult[];
}
