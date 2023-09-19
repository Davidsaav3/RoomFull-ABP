import { Component, OnInit } from '@angular/core';
import { TipoSuscripcionService } from '../../../services/tipoSuscripcion.service';
import { TarjetaAuxService } from '../../modelos/tarjeta-planes/tarjeta-planes-aux.service';

@Component({
  selector: 'app-premium-tabla',
  templateUrl: './premium-tabla.component.html',
  styleUrls: ['./premium-tabla.component.css']
})
export class PremiumTablaComponent implements OnInit {

  public planesDisponibles: any;
  public estaRegistrado: any;

  constructor(private tipoSuscripcionService:TipoSuscripcionService, private tarjetaAux: TarjetaAuxService) { }

  ngOnInit(): void {
    this.comprobarRegistro();
    this.cargarPlanes();
    this.tarjetaAux.changeMessage2("cambiar");

  }

  comprobarRegistro(){
    let token = localStorage.getItem('token');

    if (token == null){
      this.estaRegistrado = false;
    }
    else {
      this.estaRegistrado = true;
    }

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
