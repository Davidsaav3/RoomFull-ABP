import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RecuperacionComponent } from './recuperacion/recuperacion.component';
import { RegistroComponent } from './registro/registro.component';
import { AuthLayoutComponent } from '../layouts/auth-layout/auth-layout.component';
import { NoauthGuard } from '../guards/noauth.guard';

const routes: Routes = [
  {
    path:'login', component: LoginComponent, canActivate: [ NoauthGuard],
    children: [
      {path: '', component: LoginComponent},
    ]
  },
  {
    path:'recovery', component: RecuperacionComponent, canActivate: [ NoauthGuard],
    children: [
      {path: '', component: RecuperacionComponent},
    ]
  },
  {
    path:'registro', component: RegistroComponent,canActivate: [ NoauthGuard],
    children: [
      {path: '', component: RegistroComponent},
    ]
  }
  
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class AuthRoutingModule { }
