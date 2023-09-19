import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserProfilePageComponent } from './user-profile-page.component';
import { UserProfileGuardComponent } from './user-profile-guard/user-profile-guard.component';
import { UserProfileLikeComponent } from './user-profile-like/user-profile-like.component';
import { UserProfileModelosComponent } from './user-profile-modelos/user-profile-modelos.component'
import { AuthGuard } from '../../guards/auth.guard';
import { UserProfileAjustesComponent } from './user-profile-ajustes/user-profile-ajustes.component';

import { AjustesSeguridadComponent } from './user-profile-ajustes/ajustes-seguridad/ajustes-seguridad.component';
import { AjustesPremiumComponent } from './user-profile-ajustes/ajustes-premium/ajustes-premium.component';
import { AjustesPerfilComponent } from './user-profile-ajustes/ajustes-perfil/ajustes-perfil.component';
import { UserProfileEstadisticasComponent } from './user-profile-estadisticas/user-profile-estadisticas.component';

const routes: Routes = [
    {
      path: 'estadisticas/:usu', component: UserProfileEstadisticasComponent,canActivate: [AuthGuard]
    },
    {
      path: 'user', component: UserProfilePageComponent,canActivate: [AuthGuard],
      children: [
        {path:'modelo/:usu', component: UserProfileModelosComponent},
        {path:'like/:usu', component: UserProfileLikeComponent},
        {path:'guardado/:usu', component: UserProfileGuardComponent},
        {path:'ajustes/:usu', component: UserProfileAjustesComponent,
        children: [
          {path:'seguridad', component: AjustesSeguridadComponent},
          {path:'perfil', component: AjustesPerfilComponent},
          {path:'premium', component: AjustesPremiumComponent}
        ],
        },
      ],

    }

]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})


export class UserProfilePagesRoutingModule { }
