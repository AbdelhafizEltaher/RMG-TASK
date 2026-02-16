import { Component, OnInit, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ProductService } from '@services/product.service';
import { InvoiceService } from '@services/invoice.service';
import type { IProduct } from '@interfaces/product.interface';
import type { IInvoice } from '@interfaces/invoice.interfaces';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
  products = signal<IProduct[]>([]);
  invoices = signal<IInvoice[]>([]);
  loading = signal(true);

  totalProducts = computed(() => this.products().length);
  totalInvoices = computed(() => this.invoices().length);
  totalRevenue = computed(() =>
    this.invoices().reduce((sum, inv) => sum + (inv.total ?? 0), 0)
  );
  lowStockCount = computed(() =>
    this.products().filter((p) => p.stock < 5).length
  );
  invoicesByStatus = computed(() => {
    const inv = this.invoices();
    return {
      draft: inv.filter((i) => i.status === 'draft').length,
      sent: inv.filter((i) => i.status === 'sent').length,
      paid: inv.filter((i) => i.status === 'paid').length,
    };
  });

  constructor(
    private productService: ProductService,
    private invoiceService: InvoiceService
  ) {}

  ngOnInit(): void {
    forkJoin({
      products: this.productService.getAll(),
      invoices: this.invoiceService.getAll(),
    }).subscribe({
      next: ({ products, invoices }) => {
        this.products.set(products);
        this.invoices.set(invoices);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  }
}
