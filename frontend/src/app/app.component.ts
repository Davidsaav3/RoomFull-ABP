import { Component, HostListener } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Usuario } from './models/usuario.model';
import { AppAuxService } from './app-aux.service';
import { DataService2 } from './pages/modelos/editar-modelo/data2.service';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  title = 'frontend';
  siPrivado:boolean = false;
  siModelo:boolean = false;
  cookiesAccepted = localStorage.getItem('cookiesAccepted');

  constructor(
    public usu: UsuarioService,
    private appAux: AppAuxService,
    private dataAux: DataService2,
    private router: Router
    ) {

    // Para suscripciones
    try {
      this.appAux.currentMessage.subscribe(message=> {

      if (message==="cambiar"){
        this.ngOnInit();
        this.appAux.changeMessage("none");
      }

      })

    } catch (error) {
      console.log(error)
    }


    // Para modelo privado
    try {
      this.dataAux.currentMessage2.subscribe(message=> {

      if (message=="privado"){
        this.siPrivado = true;
        this.dataAux.changeMessage2("none");

      }
      })

    } catch (error) {
      console.log(error)
    }


     // Para quitar footer de modelo
     this.router.events.subscribe((e) => {
      if (e instanceof NavigationEnd) {
        console.log(e.url);
        console.log(e.url.split('/')[1])

        if (e.url.split('/')[1] == "modelo"){
          this.siModelo = true;
        }
        else {
          this.siModelo = false;
        }
      }
    });



    // Para comprobar cuántas tabs hay abiertas
    // let tabs;
    // let tabsOpenNum;

    // const tabsOpen = localStorage.getItem('tabsOpen')

    // if (tabsOpen == null) {
    //     tabs = 1;
    //     localStorage.setItem('tabsOpen', tabs.toString())
    // } else {

    //   if (tabsOpen != null){
    //     tabsOpenNum = parseInt(tabsOpen);
    //   }

    //   tabs = tabsOpenNum + 1;
    //   localStorage.setItem('tabsOpen', tabs.toString())
    // }
  }


    // Para borrar el token cuando el usuario cierra todas las pestañas del navegador
    // @HostListener("window:beforeunload",["$event"])

    // decrementTabs(event){
    //   const newTabCount = localStorage.getItem('tabsOpen')

    //   if (newTabCount !== null) {
    //     let newTabCountNum = parseInt(newTabCount) - 1;
    //     localStorage.setItem('tabsOpen', newTabCountNum.toString())
    //   }

    //   let tabsAbiertos = localStorage.getItem('tabsOpen');

    //   if (tabsAbiertos != null){

    //     let tabsAbiertosNumeros = parseInt(tabsAbiertos);
    //     if (tabsAbiertosNumeros < 1){
    //       localStorage.clear();
    //     }
    //   }
    // }


  ngOnInit() {

    // if (this.cookiesAccepted == null) {
    //   localStorage.setItem('cookiesAccepted', 'false');
    // }

    let token = this.usu.recuperarUidToken();
    if (token != null){
      this.usu.cargarUsuario(this.usu.recuperarUidToken()).subscribe(
        {
          next: (res:any) => {
            try{
              if(res.usuario.opciones[0].asistente==true){
                const chatbot = document.getElementById('chatbot-id');
                if(chatbot!=null){
                  chatbot.style.display='flex';
                }
              }
              else{
                const chatbot = document.getElementById('chatbot-id');
                if(chatbot!=null){
                  chatbot.style.display='none';
                }
              }
            }catch(e){

            }
          },
        }
        );
    }

  }






}
