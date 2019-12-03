import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LoginComponent } from 'app/shopping/components/login/login.component';

import { BsNavbarComponent } from './components/bs-navbar/bs-navbar.component';
import { HomeComponent } from './components/home/home.component';

@NgModule({
  declarations: [LoginComponent, BsNavbarComponent, HomeComponent],
  imports: [SharedModule,RouterModule.forChild([])],
  exports: [BsNavbarComponent]
})
export class CoreModule {}
