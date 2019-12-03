import { async } from "@angular/core/testing";
import { Product } from "shared/models/product";
import { Injectable } from "@angular/core";
import { AngularFireDatabase, AngularFireObject } from "@angular/fire/database";
import { take, map } from "rxjs/operators";
import { ShoppingCart } from 'shared/models/shopping-cart';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: "root"
})
export class ShoppingCartService {
  constructor(private db: AngularFireDatabase) {}


  async getCart(): Promise<Observable<ShoppingCart>>{

    let cartId = await this.getOrCreateCartId();
    return this.db.object("/shopping-carts/" + cartId).valueChanges().pipe(
      map(x => new ShoppingCart(x["items"]))
    );
  }
  async clearCart() {
    let cartId = await this.getOrCreateCartId();
    this.db.object('shopping-carts/' + cartId + '/items').query.ref.remove();
  }


  private getItem(cartId: string, productId: string){
    return this.db.object(
      "/shopping-carts/" + cartId + "/items/" + productId
    );
  }

  private async getOrCreateCartId(): Promise<string> {
    let cartId = localStorage.getItem("cartId");
    if (cartId) return cartId;

    let result = await this.create();
    localStorage.setItem("cartId", result.key);
    return result.key;
  }

  private create() {
    return this.db.list("/shopping-carts").query.ref.push({
      dateCreated: new Date().getTime()
    });
  }

  async addToCart(product: Product) {
    this.updateItemQuantity(product, 1);
  }

  async removeFromCart(product :Product){
    this.updateItemQuantity(product, -1);
  }

  private async updateItemQuantity(product: Product, change: number){
    let cartId = await this.getOrCreateCartId();
    let item$ = this.getItem(cartId, product.key);

    item$
      .valueChanges()
      .pipe(take(1))
      .subscribe((item: any) => {

        if(item){
          item$.query.ref.update({
            ...product,
            quantity: (item.quantity || 0) + change
          });

          if ((item.quantity + change) == 0) item$.remove();
        }else{
          item$.set({
            ...product,
            quantity: 1
          })
        } 
      });
  }
}
