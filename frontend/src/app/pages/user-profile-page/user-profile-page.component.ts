import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute, RouterState, Routes } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-user-profile-page',
  templateUrl: './user-profile-page.component.html',
  styleUrls: ['./user-profile-page.component.css']
})
export class UserProfilePageComponent implements OnInit {

  constructor(private route: ActivatedRoute, private usuarioService: UsuarioService) {
   // console.log('Perfil del usuario desde el page component : ',this.route.snapshot.children[0].params['usu']);

    /* this.usuarioService.cargarUsuarioNombre(this.route.snapshot.children[0].params['usu']).subscribe({
      next: ((res : any)=>{
        console.log(res)
      })
    }); */

  }

  ngOnInit(): void {

  }


  /* @HostListener('window:load')onPageLoad() {
    let content = document.getElementById('content');
    let etiquetas = Array.from(document.getElementsByClassName('nav-item-admin') as HTMLCollectionOf<HTMLElement>);
    etiquetas.forEach(elem => {

      if(elem.dataset['page']==content?.dataset['page']){
        elem.classList.add('selected');
      }

    });

}
 */
}
