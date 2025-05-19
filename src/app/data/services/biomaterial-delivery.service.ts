import { Injectable } from '@angular/core';
import { environment} from '../environments/environment';
import { BiomaterialDelivery } from '../models/biomaterial-delivery';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BiomaterialDeliveryService {

  private readonly baseUrl = environment.apiUrl + '/BiomaterialDelivery';

  constructor(
    private http: HttpClient,
  ) { }

  getBiomaterialDeliveries(filter: any) {
    let params = new HttpParams()
      .set('pageNumber', filter.pageNumber.toString())
      .set('pageSize', filter.pageSize.toString());

    if (filter.analysisCenterId) {
      params = params.set('analysisCenterId', filter.analysisCenterId.toString());
    }

    if (filter.fromDate) {
      params = params.set('fromDate', filter.fromDate.toISOString());
    }

    if (filter.toDate) {
      params = params.set('toDate', filter.toDate.toISOString());
    }

    if (filter.statusId) {
      params = params.set('statusId', filter.statusId.toString());
    }

    return this.http.get<BiomaterialDelivery[]>(`${this.baseUrl}/all`, { params });
  }

  getBiomaterialDeliveryById(id: number) {
    return this.http.get<BiomaterialDelivery>(`${this.baseUrl}/${id}`);
  }

  createBiomaterialDelivery(delivery: BiomaterialDelivery) {
    return this.http.post<BiomaterialDelivery>(`${this.baseUrl}`, delivery);
  }

  updateBiomaterialDelivery(delivery: BiomaterialDelivery) {
    return this.http.put<BiomaterialDelivery>(`${this.baseUrl}`, delivery);
  }

  deleteBiomaterialDelivery(id: number) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
