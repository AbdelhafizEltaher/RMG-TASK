import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { ProductService } from '@services/product.service';
import type { IProduct } from '@interfaces/product.interface';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [RouterLink, DecimalPipe],
  templateUrl: './product-detail.component.html',
})
export class ProductDetailComponent implements OnInit {
  product: IProduct | null = null;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? parseInt(idParam, 10) : NaN;
    if (isNaN(id)) {
      this.router.navigate(['/products']);
      return;
    }
    this.productService.getById(id).subscribe({
      next: (p) => {
        this.product = p;
      },
      error: () => {
        this.error = 'Product not found';
      },
    });
  }

  get isLowStock(): boolean {
    return this.product != null && this.product.stock < 5;
  }
}
