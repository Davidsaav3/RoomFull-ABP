import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChatService } from '../../../services/chat.service';
import { ThemeOption } from 'ngx-echarts';
import { EstadisticasService } from 'src/app/services/estadisticas.service';
import { UsuarioService } from '../../../services/usuario.service';
import { EscenaService } from '../../../services/escena.service';
import { SuscripcionService } from '../../../services/suscripcion.service';
import { TipoSuscripcionService } from 'src/app/services/tipoSuscripcion.service';


@Component({
  selector: 'app-user-profile-estadisticas',
  templateUrl: './user-profile-estadisticas.component.html',
  styleUrls: ['./user-profile-estadisticas.component.css']
})
export class UserProfileEstadisticasComponent implements OnInit {
  @Input() uidPlan= '';

  updateOptions: any;
  private uid: string = '';
  private token: any = '';
  public chatList: any;
  public usuario= this.router.routerState.snapshot.url.split('/')[2];

  public interes_arr : Number[] = [];
  public interes_nom : String[] = [];

  public grafico_ultimo : String[] = [];
  public ultimo_nombre : String[] = [];
  public ultimo_1 : Number[] = [];
  public ultimo_2 : Number[] = [];
  public ultimo_3 : Number[] = [];

  public num_modelos: 0;

  velocidad_4: any;
  modelos_datos: any;

  public textoBusqueda:any;
  public tiempoMedio = 0;

  public vis= 0;
  public like= 0;
  public guard= 0;
  interes: any;
  public sus: any;

  public val_vis= 0;
  public val_gusts= 0;
  public val_guard= 0;

  public nombre2: any;
  public precio: any;
  public descripcion: any;
  public caract: any;
  public enlace: any;
  public estaRegistrado: any;
  public idSus: any;

  actividad_total: any;
  theme: string | ThemeOption;

  private oneDay = 24 * 3600 * 1000;
  private now: Date;
  private value: number;
  public nombreUsuario: any = 'Fulloop';
  public cat= 0;
  public tip= 0;
  public nameuser: string;
  modelo : any;

  public loggedin = false;
  timeout: any = null;
  tarjetasModelos = ``;
  escenasDes : Array<any>;
  escenasRec : any;

  // Para comprobar si hay modelos
  public cantidadReal: any;

  tokenUserName: any;
  perfilPropio: boolean = false;

  // Para almacenar los modelos del usuario
  modelosUsuario : any;

  // Para almacenar los modelos
  modelosTodos:any;
  cantidadTodos:any;
  // Para almacenar los modelos que han de ser filtrados
  modelosFiltrar: any;
  cantidadFiltros:any;

  public mod_pub= 0;
  public mod_priv= 0;

  public tend_vis= "Sin datos";
  public tend_like= "Sin datos";
  public tend_guard= "Sin datos";

  public arriba_vis= 0;
  public arriba_like= 0;
  public arriba_guard= 0;

  public nombre_modelo:any;

  public num_chat= 0;

  public graf_vis= "";
  public graf_like= "";
  public graf_guard= "";

  public arriba= "M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-7.5 3.5a.5.5 0 0 1-1 0V5.707L5.354 7.854a.5.5 0 1 1-.708-.708l3-3a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 5.707V11.5z";
  public abajo= "M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v5.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V4.5z";

  mensajeErrorCantidad = 'No has subido ningún modelo';

  cantidadModelos: Number = 0;
  public velocidad_4_var= 1;

  constructor(private tipoSuscripcionService : TipoSuscripcionService, private activatedRoute: ActivatedRoute,private usuarioService: UsuarioService,private escenaService:EscenaService,private router: Router,private chatService: ChatService, private susService: SuscripcionService, private estadisticasService: EstadisticasService,private route: ActivatedRoute) {
      this.nameuser=this.route.snapshot.params['usu'];
  }


  onKeySearch(event: any) {
    clearTimeout(this.timeout);
    var $this = this;
    this.timeout = setTimeout(function () {
      if (event.keyCode != 13) {
        $this.executeListing(event.target.value);
      }
    }, 500);
  }

  private executeListing(value: string) {
    this.obtener_modelos(value);
  }

  ngOnInit(): void {
    this.uid = this.devolverId();
    // usuario / actividad / ultimo
    this.obtener_modelos('');
    // interés
    this.cargarConversacionesUsuario();
    // modelo
    this.aleatorio();
  }


  /*///////////////////// ACTIVIDAD TOTAL ////////////////////*/

  actividad_total_func(){

    this.actividad_total  = {
      tooltip: {
        trigger: 'item'
      },
      legend: {
        top: '5%',
        left: 'center',
        // doesn't perfectly work with our tricks, disable it
        selectedMode: false
      },
      series: [
        {
          name: 'Porcentaje de',
          type: 'pie',
          radius: ['40%', '70%'],
          center: ['50%', '70%'],
          // adjust the start angle
          startAngle: 180,
          label: {
            show: true,
            formatter(param) {
              // correct the percentage
              return param.name + ' (' + param.percent! * 2 + '%)';
            }
          },
          data: [

            { value: this.val_vis, name: 'Visualizaciones', itemStyle: { color: '#0073ca'}},
            { value: this.val_gusts, name: 'Me gusta', itemStyle: {color: '#ff3232'}},
            { value: this.val_guard, name: 'Guardados', itemStyle: {color: '#05a905'}},
            {
              // make an record to fill the bottom 50%
              value: 30 + 40 + 30,
              itemStyle: {
                // stop the chart from rendering this piece
                color: 'none',
                decal: {
                  symbol: 'none'
                }
              },
              label: {
                show: false
              }
            }
          ]
        }
      ]
    };


  }

  /*///////////////////// INTERES ////////////////////*/

  interes_func(){

    const numero= [];

    for(let i=0;i<5;i++){
      numero.push(this.interes_arr[i] as never);
    }

    this.interes = {
      title: {
        text: ''
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: {},
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        color: '#0073ca',
        type: 'value',
        boundaryGap: [0, 0.01]
      },
      yAxis: {
        color: '#0073ca',
        type: 'category',
        data: this.interes_nom
      },
      series: [
        {
          color: '#0073ca',
          name: 'mensajes',
          type: 'bar',
          data: numero
        }
      ]
    };
  }

  /*///////////////////// CONVERSACIONES ////////////////////*/

  cargarConversacionesUsuario(){
    this.chatService.cargarConversacionesUsuario(this.uid, "").subscribe(
      {
      next: (res:any) => {
        this.chatList = res;
        console.log(this.chatList);

        for(let i=0 ; i<this.chatList.length ; i++){
          this.interes_arr.push(this.chatList[i].mensajes.length);
          this.usuarioService.cargarUsuario(this.chatList[i].idUsuarioEmi).subscribe(
            {
              next: (res:any) => {
                console.log(res);
                this.interes_nom.push(res.usuario.nombreUsuario);
              },
              error: (err)=> {
                console.log(err);
              }
            }
          );

        }

        this.interes_nom.sort();
        this.interes_func();
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


  /*///////////////////// CANTIDAD DE MODELOS /////////////////////*/

  velocidad_4_func(){

      // A partir de las suscripciones buscamos el id
      this.susService.getSus().subscribe({
        next: (res:any) => {

          let arrIdUsu = res.Sus;
          console.log(res)

          let encontrado = false;

          for (let i = 0; i < arrIdUsu.length; i++){
            if (arrIdUsu[i].idUsuario == this.uid && !encontrado){
              // Hemos encontrado la suscripción asociada con el usuario logueado
              this.sus = arrIdUsu[i].idTipoSus;
              encontrado = true;

              this.tipoSuscripcionService.cargarTipoSusId(this.sus).subscribe({
                next:(res:any)=>{
                  console.log(res);
                  this.idSus = res.tipoSus.uid;
                  this.nombre2 = res.tipoSus.nombre;
                  this.precio = res.tipoSus.precio;
                  this.descripcion = res.tipoSus.descripcion;
                  let caractAux = res.tipoSus.caract;
                  this.num_modelos = res.tipoSus.modelos;
                  console.log(this.num_modelos)
                  this.velocidad_4 = {
                    series: [
                      {
                        color: '#0073ca',
                        min: 0,
                        max: Number(this.num_modelos),
                        splitNumber: 10,
                        type: 'gauge',
                        progress: {
                          show: true,
                          width: 8
                        },
                        axisLine: {
                          lineStyle: {
                            width: 8
                          }
                        },
                        axisTick: {
                          show: false
                        },
                        splitLine: {
                          length: 15,
                          lineStyle: {
                            width: 0,
                            color: '#999'
                          }
                        },
                        axisLabel: {
                          distance:0,
                          color: '#999',
                          fontSize: 8
                        },
                        anchor: {
                          show: true,
                          showAbove: true,
                          size: 25,
                          itemStyle: {
                            borderWidth: 10
                          }
                        },
                        title: {
                          show: false
                        },
                        detail: {
                          valueAnimation: true,
                          fontSize: 13,
                          offsetCenter: [0, '90%'],
                          formatter: '{value} modelos'
                        },
                        data: [
                          {
                            value: this.num_chat,
                            color: '#0073ca'
                          }
                        ]
                      }
                    ]
                  };

                  this.caract = caractAux.split("\n");

                }
              })

            }
          }
        },
      })



  }

  /*///////////////////// MODELO DATOS ////////////////////*/

  modelos_datos_func(){

    this.modelos_datos = {
      title: {
        text: this.nombre_modelo
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['Visualizaciones', 'Me gusta', 'Guardados']
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      toolbox: {
        feature: {
          saveAsImage: {}
        }
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: this.ultimo_nombre
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: 'Visualizaciones',
          type: 'line',
          stack: 'Total',
          color: '#0073ca',
          data: this.ultimo_1
        },
        {
          name: 'Me gusta',
          type: 'line',
          stack: 'Total',
          color: '#ff3232',
          data: this.ultimo_2
        },
        {
          name: 'Guardados',
          type: 'line',
          stack: 'Total',
          color:'#05a905',
          data: this.ultimo_3
        }
      ]
    };

  }

  /*/////////////////////////////////////////////////////////////////*/


  onChartInit(e: any) {
    //this.chartInstance = e;
    console.log('on chart init:', e);
  }

  callMethod(type: string) {
    /*if (this.chartInstance) {
      const result = this.chartInstance[type]();
      this.msg.info(`${type}(): ${result || 'void'}`);
      console.log(result);
    }*/
  }

  onChartEvent(event: any, type: string) {
    console.log('chart event:', type, event);
  }

  randomData() {
    this.now = new Date(this.now.getTime() + this.oneDay);
    this.value = this.value + Math.random() * 21 - 10;
    return {
      name: this.now.toString(),
      color: '#0073ca',
      value: [
        [this.now.getFullYear(), this.now.getMonth() + 1, this.now.getDate()].join('/'),
        Math.round(this.value)
      ]
    };
  }

  /*///////////////////// OBTENER MODELOS ////////////////////*/

  recuperarUidToken() {
    var token = localStorage.getItem('token');

    let uid = "";

    if (token != null){

      var base64Url = token.split('.')[1];
      var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      var objPayload = JSON.parse(jsonPayload);
      uid = objPayload.uid;
  }

      return uid;
  }

  obtener_modelos(valor){
    this.usuarioService.cargarUsuarioNombre(this.nameuser).subscribe({
      next:((res : any)=> {

        this.nameuser = res.usuario.nombreUsuario;

        //pedir escenas

        this.uid = this.devolverId();
        this.usuarioService.cargarUsuario(this.uid).subscribe(
          {
            next: (res:any) => {
              this.tokenUserName = res.usuario.nombreUsuario;

              // Si el perfil es propio
              if(this.nameuser==this.tokenUserName){
                //this.usuarioService.imagen;
                this.perfilPropio = true;

                // Obtener escenas propias de un usuario

                this.escenaService.obtenerEscenasPropias(valor).subscribe({
                  next:(res:any)=>{

                    console.log(res);
                    this.modelosUsuario = res['escenas'];

                    for(let i=0 ; i<res['escenas'].length ; i++){
                      if(res['escenas'][i].privado==true){
                        this.mod_priv= this.mod_priv+1;
                      }
                      if(res['escenas'][i].privado==false){
                        this.mod_pub= this.mod_pub+1;
                      }

                    }

                    console.log(this.modelosUsuario)

                    // usuario / actividad / ultimo
                    console.log(res)

                    for(let i= 0;i<res['escenas'].length;i++){
                      this.ultimo_nombre.push(res['escenas'][i].nombre);
                      this.ultimo_1.push(res['escenas'][i].NVisitas);
                      this.ultimo_2.push(res['escenas'][i].NValoraciones);
                      this.ultimo_3.push(res['escenas'][i].NGuardados);
                    }

                    this.grafico_ultimo= res['escenas'];
                    this.modelos_datos_func();

                    let total= 0;
                    let val_vis_total= 0;
                    let val_gusts_total= 0;
                    let val_guard_total= 0;

                    for(let i= 0;i<res['escenas'].length;i++){
                      val_vis_total= val_vis_total + res['escenas'][i].NVisitas;
                      val_gusts_total= val_gusts_total + res['escenas'][i].NValoraciones;
                      val_guard_total= val_guard_total + res['escenas'][i].NGuardados;
                    }
                    total= val_vis_total+val_gusts_total+val_guard_total;

                    this.nombre_modelo =  res['escenas'][0].nombre;

                    this.velocidad_4_func();
                    this.val_vis= Number((Number((val_vis_total/total)*100)).toFixed(2));
                    this.val_gusts= Number((Number((val_gusts_total/total)*100)).toFixed(2));
                    this.val_guard= Number((Number((val_guard_total/total)*100)).toFixed(2));
                    this.actividad_total_func();

                    this.num_chat= this.modelosUsuario.length;

                  }, error:(err)=>{
                    console.log(err);
                  }
                })
                //console.log('usuario propio loggeado')

              }

            },
            error: (err)=> {
              console.log(err);
            }
          }
        );

      })
    })

  }


  obtener_modelo(modelo:string){

    this.escenaService.cargarEscenasNombre(modelo).subscribe({
      next: (res:any)=> {
        this.arriba_vis = res['escenas'][0].NVisitas;
        this.arriba_like = res['escenas'][0].NValoraciones;
        this.arriba_guard = res['escenas'][0].NGuardados;
        this.aleatorio();
      }
    })


  }

  /*///////////////////// modelos datos aleatorios ////////////////////*/

  aleatorio(){
    this.vis= Math.random() * (100 - -100) + -100;
    this.like= Math.random() * (100 - -100) + -100;
    this.guard= Math.random() * (100 - -100) + -100;

    if(this.vis>=0){
      this.tend_vis= "Aumento de un " + Math.trunc(this.vis) + "%";
      this.graf_vis= this.arriba;
    }
    else{
      this.tend_vis= "Bajada de un " + Math.trunc(this.vis) + "%";
      this.graf_vis= this.abajo;
    }
    if(this.like>=0){
      this.tend_like= "Aumento de un " + Math.trunc(this.like) + "%";
      this.graf_like= this.arriba;
    }
    else{
      this.tend_like= "Bajada de un " + Math.trunc(this.like) + "%";
      this.graf_like= this.abajo;
    }
    if(this.guard>=0){
      this.tend_guard= "Aumento de un " + Math.trunc(this.guard) + "%";
      this.graf_guard= this.arriba;
    }
    else{
      this.tend_guard= "Bajada de un " + Math.trunc(this.guard) + "%";
      this.graf_guard= this.abajo;
    }
  }


}
