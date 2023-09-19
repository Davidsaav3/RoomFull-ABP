import { Component, OnInit, OnChanges, OnDestroy, ComponentFactoryResolver } from '@angular/core';
import { UsuarioService } from '../../../../services/usuario.service';
import { TipoSuscripcionService } from '../../../../services/tipoSuscripcion.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { FormBuilder, Validators } from '@angular/forms';
//import { DragulaService } from 'ng2-dragula';
import { Subscription } from 'rxjs';
 

@Component({
  selector: 'app-ajustes-premium',
  templateUrl: './ajustes-premium.component.html',
  styleUrls: ['./ajustes-premium.component.css']
})
export class AjustesPremiumComponent implements OnInit {

  suscripciones : any;

  private uid: string = '';
  public suscripcion: Array<boolean> = [];
  private token: any = '';

  public actual: string = "";
  public nombre: string = "";
  public descripcion: string = "";
  public precio: string = "";
  public planesDisponibles: any;

  constructor( private activatedRoute: ActivatedRoute,
              private router: Router,
              private usuarioService: UsuarioService,
              private tipoSuscripcionService: TipoSuscripcionService) {
              this.getTipoSus();
              this.cargarUsuario();
  }

  ngOnInit(): void {
    this.cargarPlanes();
  }

    // Decodificar el jwt del localstorage para sacar el id
    devolverId(){
      this.token = localStorage.getItem('token');
      var base64Url = this.token.split('.')[1];
      var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      // console.log(jsonPayload);
      var objPayload = JSON.parse(jsonPayload);
      var uid = objPayload.uid;
      return uid;
    }

    cargarUsuario(){
      this.usuarioService.cargarUsuario(this.devolverId()).subscribe({
          next: (res:any) => {
            this.actual = res.usuario.suscription;
            console.log(res.usuario);
          },
          error: (err)=> {
            console.log(err);
          }
        }
      );
    }

    getTipoSus() {
    this.tipoSuscripcionService.getTipoSus().subscribe(
      {
        next: (res:any) => {
          this.suscripciones = res.tipoSus;
          console.log(this.suscripciones[0].nombre);
        },
        error: (err:any)=> {
          console.log(err);
        }
      }
    );
  }

  scroll(valor: any) {
    valor.scrollIntoView({ behavior: 'smooth' });
  }

  cargarPlanes(){
    this.tipoSuscripcionService.cargarTipoSusAll().subscribe({
      next:(res:any)=>{
        this.planesDisponibles = res.tipoSus;
      }, error:(err)=>{
        console.log(err);
      }
    })
  }
}


