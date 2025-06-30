import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {catchError, forkJoin, map, Observable, of, switchMap, throwError} from 'rxjs';
import {environment} from '../environments/environment';

import {ClientOrder} from '../models/client-order';
import {OrderAnalysis} from '../models/order-analysis';
import {ClientOrderFilter} from '../filters/client-order-filter';

@Injectable({
  providedIn: 'root'
})
export class ClientOrderService {
  constructor(private http: HttpClient) { }

  private baseUrl = `${environment.apiUrl}/ClientOrder`;

  getClientOrders(filter: ClientOrderFilter): Observable<ClientOrder[]> {
    let params = new HttpParams()
      .set('pageNumber', filter.pageNumber.toString())
      .set('pageSize', filter.pageSize.toString());

    if (filter.fromDate) params = params.set('fromDate', filter.fromDate.toISOString());
    if (filter.toDate) params = params.set('toDate', filter.toDate.toISOString());
    if (filter.employeeId) params = params.set('employeeId', filter.employeeId.toString());
    if (filter.clientFullname) params = params.set('clientFullname', filter.clientFullname.toString());
    if (filter.minPrice) params = params.set('minPrice', filter.minPrice.toString());
    if (filter.maxPrice) params = params.set('maxPrice', filter.maxPrice.toString());
    if (filter.statusIds && filter.statusIds.length > 0) {
      filter.statusIds.forEach(id => {
        params = params.append('statusIds', id.toString());
      });
    }

    return this.http.get<ClientOrder[]>(`${this.baseUrl}/all`, {params});
  }

  getClientOrdersByClientId(clientId : number): Observable<ClientOrder[]> {
        return this.http.get<ClientOrder[]>(`${this.baseUrl}/Client/${clientId}`);
  }

  getClientOrderById(id: number): Observable<ClientOrder> {
    return this.http.get<ClientOrder>(`${this.baseUrl}/${id}`).pipe(
      switchMap(order => {
        return forkJoin([
          of(order),
          this.getOrderAnalysesByClientOrderId(order.clientOrderId)
        ]).pipe(
          map(([order, analyses]) => ({
            ...order,
            orderAnalyses: analyses
          }))
        );
      })
    );
  }

  createClientOrder(clientOrder: {
    orderAnalyses: { analysisId: number }[];
    clientId: number;
    fullprice: number;
    statusId: number;
    biomaterialCollections: {
      volume: number;
      inventoryInLaboratoryId: number;
      biomaterialId: number;
      collectionDate: string;
      expirationDate: string
    }[];
    employeeId: number;
    biomaterialCollectionDate: string
  }): Observable<ClientOrder> {
    return this.http.post<ClientOrder>(`${this.baseUrl}`, clientOrder);
  }

  updateClientOrder(clientOrder: ClientOrder): Observable<ClientOrder> {
    return this.http.put<ClientOrder>(`${this.baseUrl}`, clientOrder);
  }

  cancelOrder(id: number): Observable<ClientOrder> {
    return this.http.patch<ClientOrder>(`${this.baseUrl}/cancel/${id}`, {}).pipe(
      catchError(err => {
        console.error('Cancel failed', err);
        return throwError(() => new Error('Скасування не вдалося.'));
      })
    );
  }


  deleteClientOrder(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  // Order Analysis methods
  getOrderAnalysesByClientOrderId(orderId: number): Observable<OrderAnalysis[]> {
    return this.http.get<OrderAnalysis[]>(`${this.baseUrl}/${orderId}/OrderAnalysis`);
  }

  getOrderAnalysisById(id: number): Observable<OrderAnalysis> {
    return this.http.get<OrderAnalysis>(`${this.baseUrl}/OrderAnalysis/${id}`);
  }

  createOrderAnalysis(orderAnalysis: OrderAnalysis): Observable<OrderAnalysis> {
    return this.http.post<OrderAnalysis>(`${this.baseUrl}/OrderAnalysis`, orderAnalysis);
  }

  updateOrderAnalysis(orderAnalysis: OrderAnalysis): Observable<OrderAnalysis> {
    return this.http.put<OrderAnalysis>(`${this.baseUrl}/OrderAnalysis`, orderAnalysis);
  }

  deleteOrderAnalysis(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/OrderAnalysis/${id}`);
  }
}
