import { Product } from 'shared/models/product';
import { ProductService } from 'shared/services/product.service';
import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-admin-products',
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.scss']
})
export class AdminProductsComponent implements OnInit{

  dtOptions: DataTables.Settings = {};
  products: Product[];

  constructor(private productService: ProductService) { }

  ngOnInit() {
    this.productService.getAll().snapshotChanges().pipe(
     map((docArray) => {
      return docArray.map((doc) =>{
        return {
          key: doc.payload.key,
          ...doc.payload.val()
        }
      })
     })
   ).subscribe(
    (products : Product[])=>{
      this.products =products;
    }
   );

   this.dtOptions = {
    pagingType: 'full_numbers',
    pageLength: 10
  };
  }

}
