import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { SidebarChatComponent } from '.././chat-page/sidebar-chat/sidebar-chat.component';
import { ChatPageComponent } from '.././chat-page/chat-page.component';
import { ChatComponent } from '.././chat-page/chat/chat.component';
import { ChatVacioComponent } from '.././chat-page/chat-vacio/chat-vacio.component';
import { RouterOutlet } from '@angular/router';

@NgModule({
  declarations: [
    SidebarChatComponent,
    ChatComponent,
    ChatVacioComponent,
    ChatPageComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    RouterOutlet,
  ],
  providers: [],
  bootstrap: [],
  exports :[]
})
export class ChatPageModule { }
