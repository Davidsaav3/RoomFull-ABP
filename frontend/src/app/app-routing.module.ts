import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthRoutingModule } from './auth/auth.routing';
import { PagesRoutingModule } from './pages/pages.routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [

];

@NgModule({
  imports: [RouterModule.forRoot(routes), AuthRoutingModule, PagesRoutingModule],
  exports: [RouterModule]
})
export class AppRoutingModule { }
