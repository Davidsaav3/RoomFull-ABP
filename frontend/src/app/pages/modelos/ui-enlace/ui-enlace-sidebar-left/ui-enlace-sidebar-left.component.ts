import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-ui-enlace-sidebar-left',
  templateUrl: './ui-enlace-sidebar-left.component.html'
})
export class UiEnlaceSidebarLeftComponent implements OnInit {

  @Output() occultUi = new EventEmitter();

  // estados ui
  // true : mostrar
  // false : ocultar

  public uiState = true;

  public constructor() {
  }

  public ngOnInit(): void {
  }


  ocultarMostrarUi () {
    this.uiState = !this.uiState;

    this.occultUi.emit(this.uiState)


  }


}
