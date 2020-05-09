import { InMemoryDbService } from "angular-in-memory-web-api";
import { Product } from '@app/_models';
import { ProductData } from '@app/products/product-data';
import { ProductCategory, ProductCategoryData } from '@app/products/product-categories';

export class FakeBackendService implements InMemoryDbService {
  createDb() {
    let products: Product[] = ProductData.products;
    let categories: ProductCategory[] = ProductCategoryData.categories;

    return {
      products,
      categories
    };
  }
}
