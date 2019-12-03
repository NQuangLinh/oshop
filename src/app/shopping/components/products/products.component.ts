import { Observable } from "rxjs";
import { ShoppingCartService } from "shared/services/shopping-cart.service";
import { switchMap } from "rxjs/operators";
import { Component, OnInit } from "@angular/core";
import { ProductService } from "shared/services/product.service";
import { ActivatedRoute } from "@angular/router";
import { Product } from "shared/models/product";
import { map } from "rxjs/operators";
import { ShoppingCart } from "shared/models/shopping-cart";

@Component({
  selector: "app-products",
  templateUrl: "./products.component.html",
  styleUrls: ["./products.component.scss"]
})
export class ProductsComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  category: string;
  cart$: Observable<ShoppingCart>;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private shoppingCartService: ShoppingCartService
  ) {}

  async ngOnInit() {
    this.cart$ = await this.shoppingCartService.getCart();
    this.populateProducts();
  }

  private populateProducts() {
    this.productService
      .getAll()
      .snapshotChanges()
      .pipe(
        map(docArray => {
          return docArray.map(doc => {
            return {
              key: doc.payload.key,
              ...doc.payload.val()
            };
          });
        })
      )
      .pipe(
        switchMap((products: Product[]) => {
          this.products = products;
          return this.route.queryParamMap;
        })
      )
      .subscribe(params => {
        this.category = params.get("category");
        this.applyFilter();
      });
  }

  private applyFilter() {
    this.filteredProducts = this.category
      ? this.products.filter(p => p.category === this.category)
      : this.products;
  }
}
