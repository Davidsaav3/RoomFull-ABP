import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { EngineComponent } from './engine/engine.component';
import { Engine2Component } from './engine2/engine2.component';
import { ModeloNormalPageComponent } from './modelo-normal-page/modelo-normal-page.component';
import { UiInfobarBottomComponent } from './ui/ui-infobar-bottom/ui-infobar-bottom.component';
import { UiInfobarTopComponent } from './ui/ui-infobar-top/ui-infobar-top.component';
import { UiSidebarLeftComponent } from './ui/ui-sidebar-left/ui-sidebar-left.component';
import { UiSidebarRightComponent } from './ui/ui-sidebar-right/ui-sidebar-right.component';

import { UiEnlaceInfobarBottomComponent } from './ui-enlace/ui-enlace-infobar-bottom/ui-enlace-infobar-bottom.component';
import { UiEnlaceInfobarTopComponent } from './ui-enlace/ui-enlace-infobar-top/ui-enlace-infobar-top.component';
import { UiEnlaceSidebarLeftComponent } from './ui-enlace/ui-enlace-sidebar-left/ui-enlace-sidebar-left.component';
import { UiEnlaceSidebarRightComponent } from './ui-enlace/ui-enlace-sidebar-right/ui-enlace-sidebar-right.component';

import { UiComponent } from './ui/ui.component';
import { UiEnlaceComponent } from './ui-enlace/ui-enlace.component';
import { ModeloPrivadoPageComponent } from './modelo-privado-page/modelo-privado-page.component';
import { SubirModeloComponent } from './subir-modelo/subir-modelo.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TarjetaModeloComponent } from './tarjeta-modelo/tarjeta-modelo.component';
import { TarjetaModeloIndexComponent } from './tarjeta-modelo-index/tarjeta-modelo-index.component';
import { TarjetaModeloIndexDestacadosComponent } from './tarjeta-modelo-index-destacados/tarjeta-modelo-index-destacados.component';
import { EditarModeloComponent } from './editar-modelo/editar-modelo.component';
import { TarjetaPlanesComponent } from './tarjeta-planes/tarjeta-planes.component';

@NgModule({
  declarations: [
    ModeloNormalPageComponent,
    EngineComponent,
    Engine2Component,
    UiEnlaceComponent,
    UiComponent,
    UiInfobarBottomComponent,
    UiInfobarTopComponent,
    UiSidebarLeftComponent,
    UiSidebarRightComponent,
    UiEnlaceInfobarBottomComponent,
    UiEnlaceInfobarTopComponent,
    UiEnlaceSidebarLeftComponent,
    UiEnlaceSidebarRightComponent,
    ModeloPrivadoPageComponent,
    SubirModeloComponent,
    EditarModeloComponent,
    TarjetaModeloComponent,
    TarjetaModeloIndexComponent,
    TarjetaModeloIndexDestacadosComponent,
    TarjetaPlanesComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule
  ],
  providers: [],
  bootstrap: [],
  exports :[TarjetaModeloComponent, TarjetaModeloIndexComponent, TarjetaModeloIndexDestacadosComponent, EngineComponent, Engine2Component,UiComponent,UiInfobarBottomComponent,
    TarjetaPlanesComponent,
    UiInfobarTopComponent,
    UiSidebarLeftComponent,
    UiSidebarRightComponent]
})
export class ModeloPageModule { TarjetaModeloComponent : any}
