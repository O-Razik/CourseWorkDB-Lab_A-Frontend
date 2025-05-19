import {BiomaterialCollection} from "./biomaterial-collection";
import {AnalysisCenter} from './analysis-center';
import {Status} from './status';

export interface BiomaterialDelivery {
  biomaterialDeliveryId: number;
  biomaterialCollectionId: number;
  analysisCenterId: number;
  statusId: number;
  deliveryDate: string;
  analysisCenter: AnalysisCenter;
  biomaterialCollection: BiomaterialCollection;
  status: Status;
}
