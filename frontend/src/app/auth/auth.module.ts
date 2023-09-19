import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RecuperacionComponent } from './recuperacion/recuperacion.component';
import { RegistroComponent } from './registro/registro.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthLayoutComponent } from '../layouts/auth-layout/auth-layout.component';

@NgModule({
  declarations: [
    AuthLayoutComponent,
    LoginComponent,
    RecuperacionComponent,
    RegistroComponent,

  ],
  exports: [
    AuthLayoutComponent,
    LoginComponent,
    RecuperacionComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class AuthModule { }
