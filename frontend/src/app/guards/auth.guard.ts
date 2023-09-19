import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, CanDeactivate, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { UsuarioService } from '../services/usuario.service';
import { tap } from 'rxjs/operators';
import { TipoSuscripcionService } from '../services/tipoSuscripcion.service';
import { SuscripcionService } from '../services/suscripcion.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor( private usuarioService: UsuarioService, private sus: SuscripcionService, private tipoSus : TipoSuscripcionService,
               private router: Router,
               ) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot) {
      return this.usuarioService.validarToken()
              .pipe(
                tap( resp => {
                  // Si devuelve falso, el token no es bueno, salimos a login
                  if (!resp) {
                    this.router.navigateByUrl('/login')
                    .then(() => {
                    });
                  }

                  else {
                  // Si no soy admin no puedo entrar a ninguna ruta de admin-page

                    if (next.data['page'] == 'Admin'){
                      if (this.usuarioService.rol != 'Admin'){
                        this.router.navigateByUrl('/inicio')
                      }
                    }

                  // Si mi suscripción es de tipo muy gratis no debería dejar acceder a la ruta de subir-modelo
                  // console.log(next.url[0].path)
                  // if (next.url[0].path == 'subir-modelo'){

                  //   console.log(this.usuarioService)

                  //   this.sus.getSus().subscribe({
                  //     next: (res:any)=>{
                  //       let arrSus = res.Sus;

                  //         let idUsu = this.usuarioService.uid;
                  //         let idTipoSus;
                  //         let encontrada = false;

                  //         for (let index = 0; index < arrSus.length; index++) {
                  //           console.log(arrSus[index])

                  //           if (idUsu == arrSus[index].idUsuario){
                  //             idTipoSus = arrSus[index].idTipoSus;
                  //             encontrada = true;
                  //           }
                  //         }

                  //         if (encontrada== false){
                  //         this.router.navigateByUrl('/inicio')
                  //         }

                  //         this.tipoSus.getTipoSus().subscribe({
                  //           next: (res:any)=> {
                  //             let arrTipoSus = res.tipoSus;
                  //             let nombreTipoSus:any = '';

                  //             for (let index = 0; index < arrTipoSus.length; index++) {
                  //               if (idTipoSus == arrTipoSus[index].uid){
                  //                 nombreTipoSus = arrTipoSus[index].nombre;
                  //               }
                  //             }

                  //             // NO borrar por si acaso
                  //             // if (nombreTipoSus == 'Gratis'){
                  //             //   this.router.navigateByUrl('/inicio')
                  //             // }

                  //           }
                  //         })


                  //     }
                  //   })
                  // }
                }

              })
            );
  }

}
