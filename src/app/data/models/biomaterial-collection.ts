import {Biomaterial} from "./biomaterial";

import {InventoryInLaboratory} from './inventory-in-laboratory';

export interface BiomaterialCollection {
  biomaterialCollectionId: number;
  expirationDate: string;
  volume: number;
  collectionDate: string;
  biomaterialId: number;
  clientOrderId: number;
  clientOrderNumber?: number;
  inventoryInLaboratoryId: number;
  biomaterial: Biomaterial;
  inventoryInLaboratory: InventoryInLaboratory;
}

