import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import type { IInvoice, IInvoiceCreate } from '@interfaces/invoice.interfaces';
import { environment } from '@environments/environment.development';
import { HTTP_PATHS } from '@enums/http-paths.enums';

@Injectable({ providedIn: 'root' })
export class InvoiceService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<IInvoice[]> {
    return this.http.get<IInvoice[]>(environment.apiUrl + HTTP_PATHS.INVOICES);
  }

  getById(id: number): Observable<IInvoice> {
    return this.http.get<IInvoice>(`${environment.apiUrl + HTTP_PATHS.INVOICES}/${id}`);
  }

  create(invoice: IInvoiceCreate): Observable<IInvoice> {
    const subtotal = invoice.items.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0);
    const taxPct = invoice.tax ?? 0;
    const total = subtotal * (1 + taxPct / 100);
    const date = new Date().toISOString().slice(0, 10);
    const invoiceNumber = `INV-${Date.now()}`;
    const payload = {
      invoiceNumber,
      customerName: invoice.customerName,
      date,
      dueDate: invoice.dueDate,
      status: 'draft',
      items: invoice.items,
      subtotal,
      tax: taxPct,
      total: Math.round(total * 100) / 100,
    };
    return this.http.post<IInvoice>(environment.apiUrl + HTTP_PATHS.INVOICES, payload);
  }
}
