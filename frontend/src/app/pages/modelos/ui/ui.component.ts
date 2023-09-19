import {Component, HostListener, OnInit} from '@angular/core';
import { DataService2 } from '../editar-modelo/data2.service';

@Component({
  selector: 'app-ui',
  templateUrl: './ui.component.html',
  styleUrls:['../modelo-engine-general.css','./ui.component.css']
})
export class UiComponent implements OnInit {

  menuStateBool = false;

  public constructor( ) {

  }

  public ngOnInit(): void {
    const engineWrp = Array.from(document.getElementsByClassName('engine-wrapper') as HTMLCollectionOf<HTMLElement>)[0];
    const uiWrp =  Array.from(document.getElementsByClassName('ui-wrapper') as HTMLCollectionOf<HTMLElement>)[0];
    if(uiWrp!=null)
      uiWrp.style.width=engineWrp.clientWidth.toString()+'px';
      uiWrp.style.height=engineWrp.clientHeight.toString()+'px';
  }
  @HostListener('window:load', ['$event'])
  onLoad() {
    const engineWrp = Array.from(document.getElementsByClassName('engine-wrapper') as HTMLCollectionOf<HTMLElement>)[0];
    const uiWrp =  Array.from(document.getElementsByClassName('ui-wrapper') as HTMLCollectionOf<HTMLElement>)[0];

    uiWrp.style.width=engineWrp.clientWidth.toString()+'px';
    uiWrp.style.height=engineWrp.clientHeight.toString()+'px';
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
  const engineWrp = Array.from(document.getElementsByClassName('engine-wrapper') as HTMLCollectionOf<HTMLElement>)[0];
  const uiWrp =  Array.from(document.getElementsByClassName('ui-wrapper') as HTMLCollectionOf<HTMLElement>)[0];
  uiWrp.style.width=engineWrp.clientWidth.toString()+'px';
  uiWrp.style.height=engineWrp.clientHeight.toString()+'px';
}

  mostrarOcultarUi(event : any){
    //console.log(event);

    const elemWrapper = document.getElementsByClassName('ui-wrapper')[0];

    if(event == true){

      var aux = elemWrapper.children[0] as HTMLElement
      aux.style.display='flex';
      aux = elemWrapper.children[3] as HTMLElement
      aux.style.display='flex';

    } else if (event == false) {

      var aux = elemWrapper.children[0] as HTMLElement
      aux.style.display='none';
      aux = elemWrapper.children[3] as HTMLElement
      aux.style.display='none';

    }

  }

  cambiarMenuState(event: any ){
    if(event=='abierto'){
      this.menuStateBool=true;
    }else if(event=='cerrado'){
      this.menuStateBool=false;
    }
    console.log(event);
  }

}
