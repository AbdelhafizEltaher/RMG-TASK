import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IProduct, IProductCreate } from '@interfaces/product.interface';
import { environment } from '@environments/environment';
import { HTTP_PATHS } from '@enums/http-paths.enums';

@Injectable({ providedIn: 'root' })
export class ProductService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<IProduct[]> {
    return this.http.get<IProduct[]>(environment.apiUrl + HTTP_PATHS.PRODUCTS);
  }

  getById(id: number): Observable<IProduct> {
    return this.http.get<IProduct>(`${environment.apiUrl + HTTP_PATHS.PRODUCTS}/${id}`);
  }

  create(product: IProductCreate): Observable<IProduct> {
    return this.http.post<IProduct>(environment.apiUrl + HTTP_PATHS.PRODUCTS, product);
  }

  update(id: number, product: Partial<IProductCreate>): Observable<IProduct> {
    return this.http.patch<IProduct>(`${environment.apiUrl + HTTP_PATHS.PRODUCTS}/${id}`, product);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl + HTTP_PATHS.PRODUCTS}/${id}`);
  }
}
