import { UserService } from 'shared/services/user.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'shared/services/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit,  OnDestroy {

  authSubscription: Subscription;
  constructor(private userService: UserService,private auth: AuthService,private router: Router){

  }
  ngOnInit() {
    this.authSubscription  = this.auth.user$.subscribe(user => {

      if(!user) return;

      this.userService.save(user);

      let returnUrl = localStorage.getItem('returnUrl');

      if(!returnUrl) return;

      localStorage.removeItem('returnUrl');

      this.router.navigateByUrl(returnUrl);
    })
  }

  ngOnDestroy(){
    this.authSubscription.unsubscribe();
   }
}
