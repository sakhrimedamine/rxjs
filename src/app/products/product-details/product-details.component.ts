import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ProductService, AlertService } from '@app/_services';
import { catchError, map, filter } from 'rxjs/operators';
import { EMPTY, combineLatest} from 'rxjs';
import { Product } from '@app/_models';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductDetailsComponent {

  constructor(private productService: ProductService,
      protected alertService: AlertService
    ) { }

  // Product to display
  product$ = this.productService.selectedProduct$
    .pipe(
      catchError(err => {
        this.alertService.error(err);
        return EMPTY;
      })
    );


  // Set the page title
  pageTitle$ = this.product$
  .pipe(
    map((p: Product) =>
      p ? `Product Detail for: ${p.productName}` : null)
  );

  vm$ = combineLatest([
    this.product$,
    this.pageTitle$
  ]).pipe(
      filter(([product]) => Boolean(product)),
      map(([product, pageTitle]) =>
        ({ product, pageTitle }))
    );
}
