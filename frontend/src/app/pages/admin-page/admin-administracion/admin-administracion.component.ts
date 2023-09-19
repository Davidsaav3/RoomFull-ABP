import { Component, OnInit, OnChanges, OnDestroy, ComponentFactoryResolver } from '@angular/core';
import { UsuarioService } from '../../../services/usuario.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Usuario } from '../../../models/usuario.model';
import { FormBuilder, Validators } from '@angular/forms';
//import { DragulaService } from 'ng2-dragula';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-admin-administracion',
  templateUrl: './admin-administracion.component.html',
  styleUrls: ['./admin-administracion.component.css']
})
export class AdminAdministracionComponent implements OnInit {
  public usuario = new Usuario('', '', '','','','','', '', 1, '','',[],[],'');
  public uidusuario = '';
  imagen: string = '';
  nombre: string = 'Usuario';
  nom: string = 'Usuario';
  empresa: string = 'Arquitecto';
  private uid: string = '';
  private token: any = '';
  public descripcion: string = '';

  constructor( private activatedRoute: ActivatedRoute,
              private router: Router,
              private usuarioService: UsuarioService) { }

  ngOnInit(): void {
    let NavState = this.router.routerState.snapshot.url.split('/')[3];

    const navElems  = Array.from(document.getElementsByClassName('nav-item-admin'));

    navElems.forEach((elem : any) =>{
      if(NavState === elem.dataset['page']){
        elem.classList.add('selected')
      }
    })



    this.uid = this.devolverId();
    //console.log(this.uid);

    /* Cambiar por el id de tu ususario */
    //this.uid ="res.usuario.descripcion ==""";
    /* comentar la linea de arriba */

    this.cargarUsuarios();
  }

  cambiarRuta(ruta: string){
    let NavState = this.router.routerState.snapshot.url.split('/')[3];

    const navElems  = Array.from(document.getElementsByClassName('nav-item-admin'));

    navElems.forEach((elem : any) =>{

      if(ruta === elem.dataset['page']){
        elem.classList.add('selected');
      }else{
        elem.classList.remove('selected');
      }
    })

    console.log(this.router.routerState.snapshot.url);
  }

  cargarUsuarios() {

    this.usuarioService.cargarUsuario(this.uid).subscribe(
      {
        next: (res:any) => {
            this.nom = res.usuario.nombre;
            this.empresa = res.usuario.empresa;

            if(res.usuario!=null){
              if (res.usuario.metodo == "google"){
                this.imagen = res.usuario.imagen;
              }
              else {
                this.imagen =  "../../assets/uploads/fotoperfil/" +  res.usuario.imagen;
              }
            }

        },
        error: (err)=> {
          console.log(err);
        }
      }
    );
  }

      // Decodificar el jwt del localstorage para sacar el id
      devolverId (){
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

}
