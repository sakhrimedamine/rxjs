import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ProductService, ProductCategoryService, AlertService } from '@app/_services';

import { combineLatest, BehaviorSubject, EMPTY, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';


@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductListComponent  {

  constructor(
    private productService: ProductService,
    private productCategoryService: ProductCategoryService,
    protected alertService: AlertService) { }


  products$ = this.productService.productsWithAdd$;
  categories$ = this.productCategoryService.productCategories$;
  selectedProduct$ = this.productService.selectedProduct$;

  private categorySelectedSubject = new BehaviorSubject<number>(0);
  categorySelectedAction$ : Observable<number> = this.categorySelectedSubject.asObservable();

  filtredProducts$ = combineLatest([this.products$, this.categorySelectedAction$]).pipe(
    map(([products, selectedCategoryId]) =>
    products.filter(product =>
      selectedCategoryId ? product.categoryId === selectedCategoryId : true
    )),
  catchError(err => {
    this.alertService.error(err);
    return EMPTY;
  })
  );

  // Combine all streams for the view
  vm$ = combineLatest([
      this.filtredProducts$,
      this.categories$
    ]).pipe(
        map(([filtredProducts, categories]) =>
          ({ filtredProducts, categories })));


  onAdd(): void {
    this.productService.addProduct();
  }

  onSelected(categoryId: string): void {
    this.categorySelectedSubject.next(+categoryId);
  }

  onSelectedProduct(productId: number): void {
    this.productService.selectedProductChanged(productId);
  }
}
