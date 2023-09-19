import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { ModeloPageModule } from '../modelos/modelo-page.module';
import { UserProfileGuardComponent } from './user-profile-guard/user-profile-guard.component';

import { UserProfileHeaderComponent } from './user-profile-header/user-profile-header.component';
import { UserProfileLikeComponent } from './user-profile-like/user-profile-like.component';
import { UserProfileModelosComponent } from './user-profile-modelos/user-profile-modelos.component';
import { UserProfilePageComponent} from './user-profile-page.component';
import { UserProfilePagesRoutingModule } from './user-profile-page.routing';
import { UserProfileAjustesComponent } from './user-profile-ajustes/user-profile-ajustes.component';
import { AjustesSeguridadComponent } from './user-profile-ajustes/ajustes-seguridad/ajustes-seguridad.component';
import { AjustesPremiumComponent } from './user-profile-ajustes/ajustes-premium/ajustes-premium.component';
import { AjustesPerfilComponent } from './user-profile-ajustes/ajustes-perfil/ajustes-perfil.component';
import { SidebarAjustesComponent } from './user-profile-ajustes/sidebar-ajustes/sidebar-ajustes.component';
import { UserProfileEstadisticasComponent } from './user-profile-estadisticas/user-profile-estadisticas.component';

@NgModule({
  declarations: [
    UserProfileHeaderComponent,
    SidebarAjustesComponent,
    UserProfilePageComponent,
    UserProfileGuardComponent,
    UserProfileAjustesComponent,
    UserProfileModelosComponent,
    UserProfileLikeComponent,
    AjustesPerfilComponent,
    AjustesPremiumComponent,
    AjustesSeguridadComponent,
    UserProfileEstadisticasComponent
  ],
  imports: [
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts')
    }),
    BrowserModule,
    UserProfilePagesRoutingModule,
    ModeloPageModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: []
})
export class UserProfilePagesModule { }

import { NgxEchartsModule } from 'ngx-echarts';



