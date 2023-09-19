import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';


import { InfoPagesRoutingModule } from './info-pages.routing';

import { InfoLegalComponent } from './info-legal/info-legal.component';
import { InfoCookiesComponent } from './info-cookies/info-cookies.component';
import { InfoPrivacidadComponent } from './info-privacidad/info-privacidad.component';
import { PagoComponent } from './pago/pago.component';
import { PremiumTablaComponent } from './premium-tabla/premium-tabla.component';
import { ModeloPageModule } from '../modelos/modelo-page.module';
import { RouterModule, Routes, ExtraOptions } from '@angular/router';
import { NgxPayPalModule } from 'ngx-paypal';

const routerOptions: ExtraOptions = {
  anchorScrolling: "enabled",
  scrollPositionRestoration: 'enabled'
}

@NgModule({
  declarations: [
    InfoLegalComponent,
    InfoCookiesComponent,
    InfoPrivacidadComponent,
    PagoComponent

  ],
  imports: [
    BrowserModule,
    InfoPagesRoutingModule,
    NgxPayPalModule
  ],
  providers: [],
  bootstrap: []
})
export class InfoPagesModule { }



