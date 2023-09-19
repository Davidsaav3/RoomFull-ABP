import { Component, OnInit, OnChanges, OnDestroy, ComponentFactoryResolver } from '@angular/core';
import { UsuarioService } from '../../../services/usuario.service';
import { TipoSuscripcionService } from '../../../services/tipoSuscripcion.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { FormBuilder, Validators } from '@angular/forms';
//import { DragulaService } from 'ng2-dragula';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-info-landing',
  templateUrl: './info-landing.component.html',
  styleUrls: ['./info-landing.component.css']
})
export class InfoLandingComponent implements OnInit {

  suscripciones : any;
  private boton: any;
  private uid: string = '';
  public suscripcion: Array<boolean> = [];
  private token: any = '';
  public tipoSus: any;

  constructor( private activatedRoute: ActivatedRoute,
              private router: Router,
              private usuarioService: UsuarioService,
              public tipoSuscripcionService: TipoSuscripcionService) {
  }

  ngOnInit(): void {

    this.obtenerBoton();

    this.tipoSuscripcionService.getTipoSus()
      .subscribe({
        next: ((res:any) => {
          this.tipoSus = res["tipoSus"];
          this.tipoSus.forEach((t: { precio: string; }) => {
            var n = Number(t.precio);
            if(n != 0){
              t.precio = n.toFixed(2);
            }
          });
        })

      });


  }

    obtenerBoton(){

      let mybutton:any = document.getElementById("btn-back-to-top");

      window.onscroll = function () {
        scrollFunction();
      };

      function scrollFunction() {
        if (
          document.body.scrollTop > 20 ||
          document.documentElement.scrollTop > 20
        ) {
          mybutton.style.display = "block";
        } else {
          mybutton.style.display = "none";
        }
      }
      // When the user clicks on the button, scroll to the top of the document
      mybutton.addEventListener("click", backToTop);

      function backToTop() {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
      }


    }


    scrollinfo(){
      const elem = document.getElementById('roomfull');
      if(elem){
        elem.scrollIntoView({behavior: "smooth", block: "start", inline: "nearest"})
      }
    }

    scrolltop(){
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    }



}

