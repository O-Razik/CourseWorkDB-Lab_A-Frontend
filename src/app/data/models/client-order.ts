import {OrderAnalysis} from './order-analysis';
import {Employee} from './employee';
import {Client} from './client';
import {BiomaterialCollection} from './biomaterial-collection';
import {Status} from './status';

export interface ClientOrder {
  clientOrderId: number;
  number: number;
  statusId: number;
  employeeId: number;
  clientId: number;
  biomaterialCollectionDate: string;
  fullprice: number;
  biomaterialCollections: BiomaterialCollection[];
  client: Client;
  employee: Employee;
  orderAnalyses: OrderAnalysis[];
  status: Status;
}

