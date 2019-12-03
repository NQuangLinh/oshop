import {switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { auth } from "firebase/app";
import { AngularFireAuth } from "@angular/fire/auth";
import { Observable, of } from 'rxjs';
import * as firebase from "firebase";
import { ActivatedRoute } from '@angular/router';
import { AppUser } from 'shared/models/app-user';
import { UserService } from 'shared/services/user.service';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user$: Observable<firebase.User>;

  constructor(private userService: UserService,private afAuth: AngularFireAuth, private route: ActivatedRoute) { 
    this.user$ = afAuth.authState;
  }

  login(){
    let returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/';
    localStorage.setItem('returnUrl', returnUrl);
    return this.authLogin(new auth.GoogleAuthProvider());
  }

  authLogin(provider) {
    return this.afAuth.auth
      .signInWithPopup(provider)
      .then(result => {
        console.log("You have been successfully logged in!" + result);
      }) 
      .catch(error => {
        console.log(error);
      });
  }

  logut(){
    return this.afAuth.auth.signOut();
  }

  get appUser$(): Observable<AppUser>{
    return this.user$.pipe(
      switchMap(user => {
        if(user) return this.userService.get(user.uid).valueChanges();
        return of(null);
      })
    )
  };

}
