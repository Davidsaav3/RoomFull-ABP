


import { Component, OnInit, OnChanges, OnDestroy, ComponentFactoryResolver } from '@angular/core';
import { UsuarioService } from '../../../../services/usuario.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Usuario } from '../../../../models/usuario.model';
import { FormBuilder, Validators } from '@angular/forms';
//import { DragulaService } from 'ng2-dragula';
import { Subscription } from 'rxjs';
import { NavbarComponent } from '../../../../commons/navbar/navbar.component'
import { ChatService } from '../../../../services/chat.service';
import { EscenaService } from '../../../../services/escena.service';
import { editarAsistenteForm } from '../../../../interfaces/editar-formAsistente.interface';

import {
  Output,
  EventEmitter
} from '@angular/core';

@Component({
  selector: 'app-sidebar-ajustes',
  templateUrl: './sidebar-ajustes.component.html',
  styleUrls: ['./sidebar-ajustes.component.css']
})
export class SidebarAjustesComponent implements OnInit {

  constructor( private activatedRoute: ActivatedRoute,
              private router: Router,
              private usuarioService: UsuarioService,) {
    }

  ngOnInit(): void {
    let NavState = this.router.routerState.snapshot.url.split('/')[4];
    console.log(NavState);
    const navElems  = Array.from(document.getElementsByClassName('nav-item-profile'));
    console.log(navElems);
    navElems.forEach((elem : any) =>{
      if(NavState === elem.dataset['page']){
        elem.classList.add('selected')
      }
    })
  }

  cambiarRuta(ruta: string){
    const navElems  = Array.from(document.getElementsByClassName('nav-item-profile'));
    navElems.forEach((elem : any) =>{

      console.log("x "+ruta);
      console.log("y "+elem.dataset['page']);

      if(ruta === elem.dataset['page']){
        elem.classList.add('selected');
      }else{
        elem.classList.remove('selected');
      }
    })

    console.log(this.router.routerState.snapshot.url);
  }
}