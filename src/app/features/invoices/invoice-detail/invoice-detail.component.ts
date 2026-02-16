import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { NgClass } from '@angular/common';
import { InvoiceService } from '@services/invoice.service';
import type { IInvoice } from '@interfaces/invoice.interfaces';

@Component({
  selector: 'app-invoice-detail',
  standalone: true,
  imports: [RouterLink, DecimalPipe, NgClass],
  templateUrl: './invoice-detail.component.html',
})
export class InvoiceDetailComponent implements OnInit {
  invoice: IInvoice | null = null;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private invoiceService: InvoiceService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? parseInt(idParam, 10) : NaN;
    if (isNaN(id)) {
      this.router.navigate(['/invoices']);
      return;
    }
    this.invoiceService.getById(id).subscribe({
      next: (inv) => {
        this.invoice = inv;
      },
      error: () => {
        this.error = 'Invoice not found';
      },
    });
  }

  getStatusClass(status: IInvoice['status']): string {
    switch (status) {
      case 'draft':
        return 'bg-slate-100 text-slate-700';
      case 'sent':
        return 'bg-blue-500/15 text-blue-700';
      case 'paid':
        return 'bg-emerald-50 text-emerald-700';
      default:
        return 'bg-slate-100 text-slate-600';
    }
  }
}
