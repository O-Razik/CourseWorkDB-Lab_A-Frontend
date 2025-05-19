import {OrderAnalysis} from './order-analysis';
import {AnalysisCenter} from './analysis-center';
import {ClientOrder} from './client-order';
import {Analysis} from './analysis';

export interface AnalysisResult {
  analysisResultId: number;
  orderAnalysisId: number;
  indicator: number;
  executionDate: string;
  description: string;
  analysisCenterId: number;
  analysisCenter: AnalysisCenter;
  orderAnalysis: {
    orderAnalysisId: number;
    analysisId: number;
    clientOrderId: number;
    analysis: Analysis;
    clientOrder: ClientOrder;
  };
}

