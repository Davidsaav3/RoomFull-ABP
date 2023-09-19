import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { IPayPalConfig, ICreateOrderRequest, ICreateSubscriptionRequest } from 'ngx-paypal';
import { TipoSuscripcionService } from '../../../services/tipoSuscripcion.service';
import { SuscripcionService } from '../../../services/suscripcion.service';
import { TarjetaAuxService } from '../../modelos/tarjeta-planes/tarjeta-planes-aux.service';
import { UsuarioService } from '../../../services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pago',
  templateUrl: './pago.component.html',
  styleUrls: ['./pago.component.css']
})
export class PagoComponent implements OnInit {

  public id: any;
  public nombre: any;
  public payPalConfig ? : IPayPalConfig;
  showCancel: any = false;
  showSuccess: any = false;
  showError: any = false;
  valor: any = 0;
  lista: any;
  coste = true;
  public desdePerfil: Boolean = false;
  private enlace: any;

  constructor(private usuario: UsuarioService,private route: ActivatedRoute, private tipoSuscripcion: TipoSuscripcionService, private suscripcion: SuscripcionService, private router: Router, private tarjetaAux: TarjetaAuxService) {

    try {
      this.tarjetaAux.currentMessage.subscribe(message=> {
      if (message!=="none"){
        this.enlace = message;
        this.desdePerfil = true;
      }
      else {
        this.desdePerfil = false;
      }
      })

    } catch (error) {
      console.log(error)
    }


  }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get("id");
    console.log(this.id)
    this.cargarPlan(this.id);
  }


  volver (){
      // Si está desde perfil
      if (this.desdePerfil){
        this.router.navigateByUrl(this.enlace);
      }
      // Si está desde suscripciones
      else {
        this.router.navigateByUrl("/premium");
      }

  }

  cargarPlan(id){
    this.tipoSuscripcion.cargarTipoSusId(id).subscribe({
      next:(res:any)=>{
        this.nombre = res.tipoSus.nombre;
        this.valor = res.tipoSus.precio;
        if(this.valor == 0){
          this.coste = false;
        }
        this.lista = res.tipoSus.caract.split("\n");
        this.initConfig(this.id);

      }, error:(err)=>{
        console.log(err);
      }
    })
  }

  private initConfig(id: any): void {
    this.payPalConfig = {
        currency: 'EUR',
        clientId: 'AYopeJuTlWUxO0wUc8kdazSfYaebl1HvBupP-tjllWXjetoe0E7UbS2FlD-MfG1CbIp9s4P-bChk2-Qk',
        createOrderOnClient: (data) => < ICreateOrderRequest > {
            intent: 'CAPTURE',
            purchase_units: [{
                amount: {
                    currency_code: 'EUR',
                    value: this.valor,
                    breakdown: {
                        item_total: {
                            currency_code: 'EUR',
                            value: this.valor
                        }
                    }
                },
                items: [{
                    name: 'RoomFull Subscription',
                    quantity: '1',
                    category: 'DIGITAL_GOODS',
                    unit_amount: {
                        currency_code: 'EUR',
                        value: this.valor,
                    },
                }]
            }]
        },
        advanced: {
            commit: 'true'
        },
        style: {
            label: 'paypal',
            layout: 'vertical',
            color: 'blue'
        },
        onApprove: function(data) {
          alert('You have successfully created subscription ' + data.subscriptionID);
        },
        onClientAuthorization: (data) => {
            this.showSuccess = true;
        },
        onCancel: (data, actions) => {
            this.suscribirse();
            this.showCancel = true;
        },
        onError: err => {
            this.showError = true;
        },
        onClick: (data, actions) => {
            this.resetStatus();
        }
    };
  }

  private resetStatus() {
    this.showCancel = false;
    this.showSuccess = false;
    this.showError = false;
  }

  private suscribirse() {
    const uid = this.usuario.recuperarUidToken();
    let date = new Date();
    let dateFin = new Date();
    dateFin.setMonth(date.getMonth() + 1);
    const suscripcionForm : any = {
      idUsuario : uid || '',
      idTipoSus : this.id || '',
      fechaIni : date || new Date(),
      fechaFin: dateFin || new Date(),
      metodoPago : 1,
      renovacion : true
    }

    console.log(suscripcionForm)

    this.suscripcion.crearSus(suscripcionForm).subscribe((res: any) => {

      console.log(res)
      console.log('he entrado en crear sus')
      console.log(' el id es ' + uid)

      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer)
          toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
      })


      Toast.fire({
        icon: 'success',
        title: 'Suscripción actualizada con éxito'
      })

    this.tarjetaAux.changeMessage2("cambiar");

    });
  }
}
