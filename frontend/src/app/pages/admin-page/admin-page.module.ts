import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterOutlet } from '@angular/router';
import { AdminPagesRoutingModule } from './admin-page.routing';
import { BreadcrumbModule } from 'angular-crumbs';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AdminAdministracionComponent } from './admin-administracion/admin-administracion.component';
import { AdminEstadisticasComponent } from './admin-estadisticas/admin-estadisticas.component';
import { AdminModelosCrearComponent } from './admin-modelos/crear/admin-modelos-crear.component';
import { AdminModelosVerComponent } from './admin-modelos/detalles/admin-modelos-ver.component';
import { AdminModelosEditarComponent } from './admin-modelos/editar/admin-modelos-editar.component';
import { AdminModelosComponent } from './admin-modelos/admin-modelos.component';

import { AdminUsuariosComponent } from './admin-usuarios/admin-usuarios.component';
import { detallesUsuariosComponent } from './admin-usuarios/detalles/admin-usuarios-detalles.component';
import { editarUsuariosComponent } from './admin-usuarios/editar/admin-usuarios-editar.component';

import { AdminSuscripcionesComponent } from './admin-suscripciones/admin-suscripciones.component';
import { AdminConversacionesComponent } from './admin-conversaciones/admin-conversaciones.component';
import { AdministracionNavbarComponent } from './administracion-navbar/administracion-navbar.component';
import { AdminPageComponent } from './admin-page.component';
import { AdminSuscripcionesEditarComponent } from '../admin-page/admin-suscripciones/editar/admin-suscripciones-editar.component';
import { AdminSuscripcionesVerComponent } from '../admin-page/admin-suscripciones/detalles/admin-suscripciones-ver.component';
import { AdminSuscripcionesCrearComponent } from '../admin-page/admin-suscripciones/crear/admin-suscripciones-crear.component';
import { AdminConversacionesVerComponent } from './admin-conversaciones/detalles/admin-conversaciones-ver.component'
import { UiComponent } from '../modelos/ui/ui.component';
import { EngineComponent } from '../modelos/engine/engine.component';
import { ModeloPageModule } from '../modelos/modelo-page.module';


@NgModule({
  declarations: [
    AdminAdministracionComponent,
    AdminEstadisticasComponent,
    AdminModelosComponent,
    AdminUsuariosComponent,
    detallesUsuariosComponent,
    AdminSuscripcionesComponent,
    AdminConversacionesComponent,
    AdministracionNavbarComponent,
    AdminPageComponent,
    AdminConversacionesVerComponent,
    AdminSuscripcionesVerComponent,
    AdminSuscripcionesEditarComponent,
    AdminSuscripcionesCrearComponent,
    editarUsuariosComponent,
    detallesUsuariosComponent,
    AdminModelosEditarComponent,
    AdminModelosCrearComponent,
    AdminModelosVerComponent,
  ],
  imports: [
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts')
    }),
    BrowserModule,
    AdminPagesRoutingModule,
    RouterOutlet,
    BreadcrumbModule,
    FormsModule,
    ReactiveFormsModule,
    ModeloPageModule
  ],
  providers: [],
  bootstrap: []
})
export class AdminPagesModule { }

import { NgxEchartsModule } from 'ngx-echarts';

