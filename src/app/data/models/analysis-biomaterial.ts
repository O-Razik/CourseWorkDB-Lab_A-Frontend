import {Biomaterial} from "./biomaterial";

export interface AnalysisBiomaterial {
  analysisBiomaterialId: number;
  analysisId: number;
  biomaterialId: number;
  biomaterial: Biomaterial;
}
