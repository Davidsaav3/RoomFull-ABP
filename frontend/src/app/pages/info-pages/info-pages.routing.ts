import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { InfoLegalComponent } from './info-legal/info-legal.component';
import { InfoCookiesComponent } from './info-cookies/info-cookies.component';
import { InfoPrivacidadComponent } from './info-privacidad/info-privacidad.component';
import { PremiumTablaComponent } from './premium-tabla/premium-tabla.component';
import { PagoComponent } from './pago/pago.component';

const routes: Routes = [

      {
        path:'legal', component: InfoLegalComponent,
      },
      {
        path:'cookies', component:InfoCookiesComponent ,
      },
      {
        path:'privacidad', component: InfoPrivacidadComponent,
      },
      {
        path:'premium', component: PremiumTablaComponent,
      },
      {
        path: "premium/pago/:id", component: PagoComponent
      }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})


export class InfoPagesRoutingModule { }
