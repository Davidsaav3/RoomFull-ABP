import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { PagesRoutingModule } from './pages.routing';

import { SearchbarComponent } from '../commons/searchbar/searchbar.component';
import { HeaderSearchBarInvitadoComponent } from '../commons/header-search-bar-invitado/header-search-bar-invitado.component';
import { PaginadorComponent } from '../commons/paginador/paginador.component'
import { InicioPageComponent } from './inicio-pages/inicio-page/inicio-page.component';
import { InfoPagesModule } from './info-pages/info-pages.module';
import { PremiumTablaComponent } from './info-pages/premium-tabla/premium-tabla.component';
import { UserProfilePagesModule } from './user-profile-page/user-profile-page.module';
import { ModeloPageModule } from './modelos/modelo-page.module';
import { ChatPageModule } from './chat-page/chat-page.module';
import { AdminPagesModule } from './admin-page/admin-page.module';
import { FiltrosComponent } from '../commons/filtros/filtros.component';


@NgModule({
    declarations: [
        SearchbarComponent,
        HeaderSearchBarInvitadoComponent,
        InicioPageComponent,
        PremiumTablaComponent,
        PaginadorComponent,
        FiltrosComponent
    ],
    providers: [
    ],
    bootstrap: [],
    imports: [
        BrowserModule,
        PagesRoutingModule,
        InfoPagesModule,
        UserProfilePagesModule,
        ModeloPageModule,
        ChatPageModule,
        AdminPagesModule
    ]
})
export class PagesModule { }
