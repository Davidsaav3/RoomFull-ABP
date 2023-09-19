import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminPagesRoutingModule } from './admin-page/admin-page.routing';
import { InfoPagesRoutingModule } from './info-pages/info-pages.routing';
import { InicioPageComponent } from './inicio-pages/inicio-page/inicio-page.component';
import { ChatPageComponent } from './chat-page/chat-page.component';
import { UserProfilePagesRoutingModule } from './user-profile-page/user-profile-page.routing';

import { PremiumTablaComponent } from './info-pages/premium-tabla/premium-tabla.component';
import { ChatPagesRoutingModule } from './chat-page/chat-page.routing';
import { ModeloNormalPageComponent } from './modelos/modelo-normal-page/modelo-normal-page.component';
import { EngineComponent } from './modelos/engine/engine.component';
import { ModeloPrivadoPageComponent } from './modelos/modelo-privado-page/modelo-privado-page.component';
import { SubirModeloComponent } from './modelos/subir-modelo/subir-modelo.component';
import { AuthGuard } from '../guards/auth.guard';
import { InfoLandingComponent } from './info-pages/info-landing/info-landing.component';
import { EditarModeloComponent } from './modelos/editar-modelo/editar-modelo.component';
import { Engine2Component } from './modelos/engine2/engine2.component';

const routes: Routes = [


  {
    path:'inicio', component: InicioPageComponent
  },

  { path:'chat', component: ChatPageComponent, canActivate:[AuthGuard]

  },

  { path:'premium', component: PremiumTablaComponent

  },

  { path:'modelo/:id', component: ModeloNormalPageComponent, canActivate:[AuthGuard]

  },

  { path:'enlace-modelo/:id', component: ModeloPrivadoPageComponent

  },

  { path:'subir-modelo', component: SubirModeloComponent, canActivate:[AuthGuard]

  },
  { path:'editar-modelo/:id', component: EditarModeloComponent, canActivate:[AuthGuard]

  },

  { path:'landing', component: InfoLandingComponent

  },
  { path:'pruebaEngine', component: Engine2Component

  },
  {
    path:'**',
    redirectTo: 'inicio'
  },
]

@NgModule({
    imports: [RouterModule.forRoot(routes),AdminPagesRoutingModule,InfoPagesRoutingModule, UserProfilePagesRoutingModule, ChatPagesRoutingModule],
    exports: [RouterModule]
})


export class PagesRoutingModule { }
