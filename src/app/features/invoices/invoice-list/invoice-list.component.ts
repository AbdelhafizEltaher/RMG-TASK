import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';
import { InvoiceService } from '@services/invoice.service';
import type { IInvoice } from '@interfaces/invoice.interfaces';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-invoice-list',
  standalone: true,
  imports: [RouterLink, DecimalPipe, NgClass],
  templateUrl: './invoice-list.component.html',
})
export class InvoiceListComponent implements OnInit {
  invoices = signal<IInvoice[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  constructor(private invoiceService: InvoiceService) {}

  ngOnInit(): void {
    this.invoiceService.getAll().subscribe({
      next: (list) => {
        this.invoices.set(list);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err?.message || 'Failed to load invoices. Is the API running? Run: npm run api');
        this.loading.set(false);
      }
    });
  }
}
