import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { CategoryService } from 'shared/services/category.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'product-filter',
  templateUrl: './product-filter.component.html',
  styleUrls: ['./product-filter.component.scss']
})
export class ProductFilterComponent implements OnInit {
  
  categories$: Observable<any[]>;
  @Input("category") category;
  
  constructor(private categoryService: CategoryService) { 
    
  }

  ngOnInit() {
    this.categories$ = this.categoryService.getCategories().snapshotChanges().pipe(
      map(docArray =>{
        return docArray.map(doc =>{
          return {
            key: doc.payload.key,
            ...doc.payload.val()
          }
        })
      })
    );
  }

}
