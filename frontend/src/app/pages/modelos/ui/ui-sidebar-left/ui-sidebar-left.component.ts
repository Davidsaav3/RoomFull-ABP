import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-ui-sidebar-left',
  templateUrl: './ui-sidebar-left.component.html'
})
export class UiSidebarLeftComponent implements OnInit {

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
