import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ChatComponent } from './chat/chat.component';
import { ChatVacioComponent } from './chat-vacio/chat-vacio.component';
import { ChatPageComponent } from './chat-page.component';
import { AuthGuard } from '../../guards/auth.guard';

const routes: Routes = [

  {
    path:'chat', component: ChatPageComponent, canActivate:[AuthGuard],
    children: [
      {path:'usuario/:chat', component: ChatComponent},
      {path:'', component: ChatVacioComponent}
    ]
  }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})


export class ChatPagesRoutingModule { }
