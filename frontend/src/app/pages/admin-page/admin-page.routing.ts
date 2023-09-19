import { NgModule } from '@angular/core';
import { RouterModule, Routes, Router } from '@angular/router';

import { AdminAdministracionComponent } from './admin-administracion/admin-administracion.component';
import { AdminEstadisticasComponent } from './admin-estadisticas/admin-estadisticas.component';
import { AdminModelosComponent } from './admin-modelos/admin-modelos.component';
import { AdminModelosCrearComponent } from './admin-modelos/crear/admin-modelos-crear.component';
import { AdminModelosEditarComponent } from './admin-modelos/editar/admin-modelos-editar.component';
import { AdminModelosVerComponent } from './admin-modelos/detalles/admin-modelos-ver.component';

import { AdminUsuariosComponent } from './admin-usuarios/admin-usuarios.component';
import { detallesUsuariosComponent } from './admin-usuarios/detalles/admin-usuarios-detalles.component';
import { editarUsuariosComponent } from './admin-usuarios/editar/admin-usuarios-editar.component';

import { AdminSuscripcionesComponent } from './admin-suscripciones/admin-suscripciones.component';
import { AdminSuscripcionesCrearComponent } from './admin-suscripciones/crear/admin-suscripciones-crear.component';
import { AdminSuscripcionesEditarComponent } from './admin-suscripciones/editar/admin-suscripciones-editar.component';
import { AdminSuscripcionesVerComponent } from './admin-suscripciones/detalles/admin-suscripciones-ver.component';

import { AdministracionNavbarComponent } from './administracion-navbar/administracion-navbar.component';
import { AdminConversacionesComponent } from './admin-conversaciones/admin-conversaciones.component';
import { AdminPageComponent } from './admin-page.component';
import {AuthGuard} from '../../guards/auth.guard';
import { AdminConversacionesVerComponent } from '../../pages/admin-page/admin-conversaciones/detalles/admin-conversaciones-ver.component';

import { Breadcrumb } from 'angular-crumbs';

const routes: Routes = [

  {
    path:'admin', component: AdminPageComponent, canActivate: [AuthGuard], data: { page: 'Admin'},
    children: [
      {path:'administracion', component: AdminAdministracionComponent, children: [
        {
          path:'modelos',
          // data: { breadcrumb: 'Modelos'},
          children: [
            {
              path: '',
              component: AdminModelosComponent
            },
            {
              path: ':nombreModelo',
              data: { breadcrumb: 'Detalles'},
              children: [
                {
                  path: '',
                  component: AdminModelosVerComponent
                },
                {
                  path: 'editar',
                  data: { breadcrumb: 'Editar modelo'},
                  component: AdminModelosEditarComponent
                },
                {
                  path: '**',
                  component: AdminModelosVerComponent
                }
              ]
            },
            {
              path: '**',
              component: AdminModelosComponent
            },
          ]
        },
        {
          path:'suscripciones',
          // data: { breadcrumb: 'Suscripciones'},
          children: [
            {
              path: '',
              component: AdminSuscripcionesComponent
            },
            {
              path: 'crear',
              data: { breadcrumb: 'Crear suscripción'},
              component: AdminSuscripcionesCrearComponent
            },
            {
              path: ':nombreTipoSus',
              data: { breadcrumb: 'Detalles'},
              children: [
                {
                  path: '', //:suscripcion
                  // data: { breadcrumb: 'Suscripcion'},
                  component: AdminSuscripcionesVerComponent
                },
                {
                  path: 'editar',
                  data: { breadcrumb: 'Editar suscripción'},
                  component: AdminSuscripcionesEditarComponent
                },
                {
                  path: '**',
                  component: AdminSuscripcionesVerComponent
                }
              ]
            },
            {
              path: '**',
              component: AdminSuscripcionesComponent
            },
          ]
        },
        {
          path:'discusiones',
          // data: { breadcrumb: 'Conversaciones'},
          children: [
            {
              path: '',
              component: AdminConversacionesComponent
            },
            {
              path: ':chat',
              data: { breadcrumb: 'Chat'},
              component: AdminConversacionesVerComponent
            },
            {
              path: '**',
              component: AdminConversacionesComponent
            },
          ]
        },
        {
          path:'usuarios',
          // data: {breadcrumb: 'Usuarios' },
          children: [
            {
              path: '',
              component: AdminUsuariosComponent
            },
            {
              path: ":nombreUsuario",
              data: { breadcrumb: 'Detalles'},
              children: [
                {
                  path:'',
                  component: detallesUsuariosComponent,
                },
                {
                  path: "editar",
                  component: editarUsuariosComponent,
                  data: { breadcrumb: 'Editar Usuario' }
                },
                {
                  path:'**',
                  component: detallesUsuariosComponent,
                }
              ]
            },
            {
              path: '**',
              component: AdminUsuariosComponent
            }
          ]
        },
        {path:'metricas', component: AdminEstadisticasComponent}
       ]
      },
      // {path:'estadisticas', component: AdminEstadisticasComponent}
    ]
  }

]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})


export class AdminPagesRoutingModule { }
