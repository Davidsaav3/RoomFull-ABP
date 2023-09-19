import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { FormBuilder, Validators } from '@angular/forms';
import { SuscripcionService } from 'src/app/services/suscripcion.service';
import { TipoSuscripcionService } from 'src/app/services/tipoSuscripcion.service';

@Component({
  selector: 'app-admin-usuarios-detalles',
  templateUrl: './admin-usuarios-detalles.component.html',
  styleUrls: ['./admin-usuarios-detalles.component.css']
})
export class detallesUsuariosComponent implements OnInit {
  formDesc = this.fb.group({
    description: ['', Validators.required]
  });

  constructor(
    public admin: AdminService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private susService: SuscripcionService,
    private tipoSuscripcionService : TipoSuscripcionService) {
  }

  imagen: String = '';
  name: string;
  usuario: any;
  result: any;
  tieneSub: boolean = false;

  private uid: any;
  private token:any;
  private sus:any;
  public nombreSus:any;
  public precioSus:any;
  public descripcionSus:any;
  public caractSus:any;


  url: any;

  ngOnInit(): void {
    this.uid = this.devolverId ();
    this.url = window.location.href.split("/");
    this.name = this.url[this.url.length - 1];

    this.obtenerDatos();
  }

  obtenerDatos(){
    this.admin.cargarUsuarioNombre(this.name)
    .subscribe((res: any) => {
      this.usuario = res.usuario;
      this.imagen = this.usuario.imagen;
      if(this.imagen.includes("googleusercontent")){
        this.imagen = this.usuario.imagen;
      }else{
        this.imagen = "../../assets/uploads/fotoperfil/" + this.usuario.imagen;
      }
      if(res.usuario.subscription.includes("registro_")){
        this.tieneSub = true;
        this.obtenerSub();
      }else{
        this.tieneSub = false;
      }

    })
  }

  devolverId (){
    this.token = localStorage.getItem('token');
    var uid = ''
    if(this.token){
      var base64Url = this.token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    // console.log(jsonPayload);
    var objPayload = JSON.parse(jsonPayload);
    uid = objPayload.uid;
    }

    return uid;
  }

  obtenerSub(){

  // Dado su id hago una petición a las suscripciones
  this.susService.getSus().subscribe({
    next: (res:any) => {

      let arrIdUsu = res.Sus;
      console.log(arrIdUsu)

      let encontrado = false;

      for (let i = 0; i < arrIdUsu.length; i++){
        if (arrIdUsu[i].idUsuario == this.uid && !encontrado){
          // Hemos encontrado la suscripción asociada con el usuario logueado
          this.sus = arrIdUsu[i].idTipoSus;
          encontrado = true;
        }
      }

      // Obtenemos el nombre
      this.tipoSuscripcionService.cargarTipoSusId(this.sus).subscribe({
        next:(res:any)=>{
          this.nombreSus = res.tipoSus.nombre;
          this.precioSus = res.tipoSus.precio;
          this.descripcionSus = res.tipoSus.descripcion;
          this.caractSus = res.tipoSus.caract;
        }
      })



    },
  })

  }

  volver(){
    this.router.navigateByUrl("/admin/administracion/usuarios");
  }

  editar(){
    this.router.navigateByUrl("/admin/administracion/usuarios/"+this.name+"/editar");
  }

  cambiarDescripcion(data:any){
    if(this.formDesc.valid){
      console.log(this.formDesc.controls.description.value);
      this.admin.actualizarUsuDescription(this.usuario.uid,this.formDesc.controls.description.value).subscribe({
        next:((res:any)=>{
          console.log(res);
          if(res.ok){
            this.usuario.descripcion=this.formDesc.controls.description.value || '';
            this.ocultarForm();
          }
        })
      });
    }
  }

  mostrarForm(){
    const formEl = document.getElementById('formDesc');
    if(formEl)
    formEl.style.display="inline";
  }

  ocultarForm(){
    const formEl = document.getElementById('formDesc');
    if(formEl)
    formEl.style.display="none";
  }
}
