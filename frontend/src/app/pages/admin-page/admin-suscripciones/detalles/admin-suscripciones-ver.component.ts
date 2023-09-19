import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TipoSuscripcionService } from '../../../../services/tipoSuscripcion.service';
import { UsuarioService } from '../../../../services/usuario.service';
import Swal from 'sweetalert2';
import { FormBuilder, Validators } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser'
import { CommonModule } from '@angular/common'
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-admin-suscripciones-ver',
  templateUrl: './admin-suscripciones-ver.component.html',
  styleUrls: ['./admin-suscripciones-ver.component.css']
})
export class AdminSuscripcionesVerComponent implements OnInit {

  public suscripciones : any;
  param: string='';
  private uid: string = '';
  public suscripcion: Array<boolean> = [];
  private token: any = '';
  tipoSus: any;
  public planesDisponibles: any;
  public idSus:any = '';
  public nombre:any = '';
  public precio:any = '';
  public caract:any = '';
  public descripcion:any = '';
  public modelos:any = '';

  constructor( private activatedRoute: ActivatedRoute,
    private router: Router,
    private usuarioService: UsuarioService,
    public tipoSuscripcionService: TipoSuscripcionService,
    private route: ActivatedRoute
    ) {
      this.param= this.route.snapshot.params['nombreTipoSus'];
      console.log(this.param);
    }


    ngOnInit(): void {
      this.idSus = this.route.snapshot.params['nombreTipoSus'];
      this.getTipoSus();
    }

    getTipoSus() {
      this.tipoSuscripcionService.cargarTipoSusId(this.idSus).subscribe(
        {
          next: (res:any) => {
            console.log(res)
            this.nombre = res.tipoSus.nombre;
            this.precio = res.tipoSus.precio;
            this.caract = res.tipoSus.caract;
            this.descripcion = res.tipoSus.descripcion;
            this.modelos = res.tipoSus.modelos;

            console.log(this.modelos);
          },
          error: (err:any)=> {
            console.log(err);
          }
        }
      );
    }

  volver (){
    this.router.navigateByUrl("/admin/administracion/suscripciones");
  }

  verConver(){
    this.router.navigateByUrl("/admin/administracion/ver-discusiones");
  }

  crearConver(){
    this.router.navigateByUrl("/admin/administracion/crear-discusiones");
  }

  scroll(valor: any) {
    valor.scrollIntoView({ behavior: 'smooth' });
  }


  editar(){
    this.router.navigateByUrl("/admin/administracion/suscripciones/"+this.suscripcion+"/editar");
  }
}
