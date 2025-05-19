import {AnalysisBiomaterial} from './analysis-biomaterial';
import {Category} from './category';

export interface Analysis {
  analysisId: number;
  name: string;
  categoryId: number;
  description: string;
  price: number;
  analysisBiomaterials: AnalysisBiomaterial[];
  category: Category;
}
