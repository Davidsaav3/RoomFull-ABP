import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ChatService } from '../../../services/chat.service';
import LinearGradient from 'zrender/lib/graphic/LinearGradient';
import type { EChartsOption } from 'echarts';
import { ThemeOption } from 'ngx-echarts';
import { EstadisticasService } from 'src/app/services/estadisticas.service';


@Component({
  selector: 'app-admin-estadisticas',
  templateUrl: './admin-estadisticas.component.html',
  styleUrls: ['./admin-estadisticas.component.css']
})
export class AdminEstadisticasComponent implements OnInit {
  updateOptions: any;
  private uid: string = '';
  private token: any = '';
  public chatList: any;

  tiempo_usuarios_velocidad_1: any;
  tiempo_usuarios_lineas_1: any;

  paises_suscripcion_barras_1: any;

  suscripciones_superiores_barras_1: any;

  repercusion_modelo_velocidad_1: any;
  repercusion_modelo_velocidad_2: any;
  repercusion_modelo_velocidad_3: any;
  repercusion_modelo_barras_1: any;

  usuarios_conversaciones_barras_1: any;

  theme: string | ThemeOption;

  // linea
  private oneDay = 24 * 3600 * 1000;
  private now: Date;
  private value: number;
  private data: any[];
  private timer: any;

  public nombreUsuario: any = 'Fulloop';

  //Variables de estadisticas API
  public tiempoMedio = 0;
  public susPaisGratuita = '';
  public susPaisPremium = '';
  public susPaisPremiumPlus = '';
  public susPaisPremiumUltra = '';
  public chats= '';
  public paises= '';

  public mes_nombre : Number[] = [];
  public mes_val : Object[] = [];
  public tiempo_medio: Number[] = [];
  public tiempo_medio_mes: Object[] = [];
  public tiempo_medio_meses: Object[] = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];

  public cat= 0;
  public tip= 0;

  public arrMetodoPaisesPorSus : Object[] = [];
  public arrMetodoPaisesPorSus_1 : Object[] = [];
  public arrMetodoUsuSuperiores : Number[] = [];
  public arrMetodoUsuMasConversaciones : Object[] = [];
  public arrMetodoModMasRep : Object[] = [];
  public arrMetodoModMasRep_1 : Object[] = [];
  public arrConversaciones : Object[] = []

  //Aux Variables
  public categoria:string = "Visualizaciones";
  public tipo_sus:string = "Gratuita";

  constructor( private activatedRoute: ActivatedRoute,
    private router: Router,private chatService: ChatService, private estadisticasService: EstadisticasService) {
}


  ngOnInit(): void {

    this.uid = this.devolverId();
    this.cargarConversacionesUsuario();

    //Funciones de carga de estadisticas
    this.cargarTiempoMedioUsuario();
    this.cargarPaisesPorSuscripcion();
    this.cargarUsuariosPremium();
    this.cargarUsuariosMasConversaciones();
    this.cargarModelosMasRepercusion();

    /*this.cat= 0;
    this.tip= 0;
    this.cambiar_cat(0);
    this.cambiar_tip(0);*/
  }
////////// Metodos Estadisticas API /////////////
  cargarTiempoMedioUsuario(){

  this.estadisticasService.obtenerTiempoMedio().subscribe({
    next: (res:any) =>{
      console.log(res);
      this.tiempoMedio = res['resultado']['tiempoMedio'];
      console.log("resp: "+this.tiempoMedio);

      this.tiempo_usuarios_velocidad_1_func();
    },
    error: (err) =>{
      console.log(err);
    }
  });

  this.estadisticasService.obtenerTiempoMedioM1('1m').subscribe({
    next: (res:any) =>{
      console.log('AQUIIIIIIIII');
      console.log(res['resultado']['tiempoMedio']);
      this.tiempo_medio.push(res['resultado']['tiempoMedio']);
    },
    error: (err) =>{
      console.log(err);
    }
  });

  this.estadisticasService.obtenerTiempoMedioM2('2m').subscribe({
    next: (res:any) =>{
      console.log(res['resultado']['tiempoMedio']);
      this.tiempo_medio.push(res['resultado']['tiempoMedio']);
    },
    error: (err) =>{
      console.log(err);
    }
  });

  this.estadisticasService.obtenerTiempoMedioM3('4m').subscribe({
    next: (res:any) =>{
      console.log(res['resultado']['tiempoMedio']);
      this.tiempo_medio.push(res['resultado']['tiempoMedio']);
    },
    error: (err) =>{
      console.log(err);
    }
  });

  this.estadisticasService.obtenerTiempoMedioM4('5m').subscribe({
    next: (res:any) =>{
      console.log(res['resultado']['tiempoMedio']);
      this.tiempo_medio.push(res['resultado']['tiempoMedio']);
    },
    error: (err) =>{
      console.log(err);
    }
  });

  this.estadisticasService.obtenerTiempoMedioM5('6m').subscribe({
    next: (res:any) =>{
      console.log(res['resultado']['tiempoMedio']);
      this.tiempo_medio.push(res['resultado']['tiempoMedio']);
      this.tiempo_usuarios_lineas_1_func();
    },
    error: (err) =>{
      console.log(err);
    }
  });


}



  cargarPaisesPorSuscripcion(){
    this.estadisticasService.obtenerPaisesPorSuscripcion().subscribe({
      next: (res:any) =>{
        console.log(res);
        this.susPaisGratuita = res['gratuita'];
        this.susPaisPremium = res['premium'];
        this.susPaisPremiumPlus = res['premiumPlus'];
        this.susPaisPremiumUltra = res['premiumUltra'];

        this.arrMetodoPaisesPorSus[0] = res['gratuita'];
        this.arrMetodoPaisesPorSus[1] = res['premium'];
        this.arrMetodoPaisesPorSus[2] = res['premiumPlus'];
        this.arrMetodoPaisesPorSus[3] = res['premiumUltra'];

        this.paises_suscripcion_barras_1_func(0);
      },
      error: (err) =>{
        console.log(err);
      }
    });
  }
  cargarUsuariosPremium(){
    this.estadisticasService.obtenerUsuariosPremium().subscribe({
      next: (res:any) =>{
        console.log(res);
        this.arrMetodoUsuSuperiores[0] = res['totalUsuarios'][0].totalUsuarios;
        this.arrMetodoUsuSuperiores[1] = res['usuarioSuperiores'][0].usuarioSuperiores;
        this.arrMetodoUsuSuperiores[2] = res['usuariosPremium'][0].usuariosPremium;
        this.arrMetodoUsuSuperiores[3] = res['usuariosPremiumPlus'][0].usuariosPremiumPlus;
        this.arrMetodoUsuSuperiores[4] = res['usuariosPremiumUltra'][0].usuariosPremiumUltra;

        this.suscripciones_superiores_barras_1_func();
      },
      error: (err) =>{
        console.log(err);
      }
    })
  }

  cargarModelosMasRepercusion(){
    this.estadisticasService.obtenerModelosMasRepercusion().subscribe({
      next: (res:any) =>{
        console.log("modelos mas repercusion")
        console.log(res);

        this.arrMetodoModMasRep_1[0] = res['modelosMasVisualizaciones'];
        this.arrMetodoModMasRep_1[1] = res['modelosMasLikes'];
        this.arrMetodoModMasRep_1[2] = res['modelosMasGuardados'];

        this.arrMetodoModMasRep[0] = this.arrMetodoModMasRep_1[0];
        this.arrMetodoModMasRep[1] = this.arrMetodoModMasRep_1[1];
        this.arrMetodoModMasRep[2] = this.arrMetodoModMasRep_1[2];

        console.log(this.arrMetodoModMasRep[0]);
        console.log(this.arrMetodoModMasRep[1]);
        console.log(this.arrMetodoModMasRep[2]);

        this.repercusion_modelo_velocidad_1_func();
        this.repercusion_modelo_velocidad_2_func();
        this.repercusion_modelo_velocidad_3_func();
        this.repercusion_modelo_barras_1_func();
      },
      error: (err) =>{
        console.log(err);
      }
    })
  }

  cargarUsuariosMasConversaciones(){
    this.estadisticasService.obtenerUsuariosMasConversaciones().subscribe({
      next: (res:any) =>{
        this.chats= res;
        console.log(res);

        this.arrConversaciones[0] = res['totalConversaciones'];

        this.usuarios_conversaciones_barras_1_func();
        res['totalConversaciones'].forEach((element:any,index:any) => {
          this.arrMetodoUsuMasConversaciones[index] = element;
        });
      },
      error: (err) =>{
        console.log(err);
      }
    })
  }


  cambiar_cat(cant){
    this.arrMetodoModMasRep_1.splice(0);
    this.arrMetodoModMasRep_1.push(this.arrMetodoModMasRep[cant]);
    switch (cant) {
      case 0:
        this.categoria = "Visualizaciones";
        break;
      case 1:
        this.categoria = "Me gustas";
        break;
      case 2:
        this.categoria = "Guardados";
        break;
      default:
        break;
    }
    this.repercusion_modelo_velocidad_1_func();
    this.repercusion_modelo_velocidad_2_func();
    this.repercusion_modelo_velocidad_3_func();
  }

  cambiar_tip(cant){
    this.paises_suscripcion_barras_1_func(cant);
    switch (cant) {
      case 0:
        this.tipo_sus = "Gratuita";
        break;
      case 1:
        this.tipo_sus = "Premium";
        break;
      case 2:
        this.tipo_sus = "Premium Plus";
        break;
      case 3:
        this.tipo_sus = "Premium Ultra";
        break;
      default:
        break;
    }
  }



////////// Metodos Estadisticas API /////////////

  cargarConversacionesUsuario(){
    this.chatService.cargarConversacionesUsuario(this.uid, "").subscribe(
      {
      next: (res:any) => {
        this.chatList = res;
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

  eliminarSuscripciones (){
    this.router.navigateByUrl("/admin/administracion/eliminar-discusiones");
  }

  verSuscripciones(){
    this.router.navigateByUrl("/admin/administracion/ver-suscripciones");
  }

  editarSuscripciones(){
    this.router.navigateByUrl("/admin/administracion/editar-suscripciones");
  }

  crearSuscripciones(){
    this.router.navigateByUrl("/admin/administracion/crear-suscripciones");
  }

  /*///////////////////// TIEMPO USUARIOS /////////////////////*/

  /* cantidad 1 */
  tiempo_usuarios_velocidad_1_func(){
    console.log("resp: "+this.tiempoMedio);

    this.tiempo_usuarios_velocidad_1 = {
      series: [
        {
          color: '#0073ca',
          min: 0,
          max: 24,
          splitNumber: 12,
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
            fontSize: 30,
            offsetCenter: [0, '90%'],
            formatter: '{value}h'
          },
          data: [
            {
              value: this.tiempoMedio,
              color: '#0073ca'
            }
          ]
        }
      ]
    };
  }


  /* lineas-1 */
  tiempo_usuarios_lineas_1_func(){
    let fecha= new Date();

    let m1= fecha.getMonth()-1;
    if(fecha.getMonth()-1<0){
      m1= 12+(fecha.getMonth()-1);
    }
    this.tiempo_medio_mes.push(this.tiempo_medio_meses[m1]);

    let m2= fecha.getMonth()-2;
    if(fecha.getMonth()-2<0){
      m2= 12+(fecha.getMonth()-2);
      console.log(m2);
    }
    this.tiempo_medio_mes.push(this.tiempo_medio_meses[m2]);

    let m3= fecha.getMonth()-3;
    if(fecha.getMonth()-3<0){
      m3= 12+(fecha.getMonth()-3);
    }
    this.tiempo_medio_mes.push(this.tiempo_medio_meses[m3]);

    let m4= fecha.getMonth()-4;
    if(fecha.getMonth()-4<0){
      m4= 12+(fecha.getMonth()-4);
    }
    this.tiempo_medio_mes.push(this.tiempo_medio_meses[m4]);

    let m5= fecha.getMonth()-5;
    if(fecha.getMonth()-5<0){
      m5= 12+(fecha.getMonth()-5);
    }
    this.tiempo_medio_mes.push(this.tiempo_medio_meses[m5]);
    this.tiempo_medio_mes.reverse();

    this.tiempo_usuarios_lineas_1 = {
      title: {
        text: 'Horas'
      },
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['Tiempo medio']
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
        data: this.tiempo_medio_mes
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: 'Tiempo medio',
          type: 'line',
          stack: 'Total',
          color: '#0073ca',
          data: this.tiempo_medio
        }
      ]
    };
}

  /*///////////////////// 5 PAISES X SUSCRIPCIÓN /////////////////////*/


  /* barras-2 */
  paises_suscripcion_barras_1_func(cant){

    console.log(this.arrMetodoPaisesPorSus[0]);
    const pais= [];
    const numero= [];

    if(cant!=0 && cant!=1 && cant!=2 && cant!=3){
      cant=0;
    }

    for(let i=0;i<5;i++){
      pais.push(this.arrMetodoPaisesPorSus[cant][i].pais as never);
      numero.push(this.arrMetodoPaisesPorSus[cant][i].numero as never);
    }

    this.paises_suscripcion_barras_1 = {
      legend: {
        data: ['bar'],
        align: 'left',
      },
      tooltip: {},
      xAxis: {
        data: pais,
        silent: false,
        splitLine: {
          show: false,
        },
      },
      yAxis: {},
      series: [
        {
          color: '#0073ca',
          name: 'País',
          type: 'bar',
          data: numero,
          animationDelay: (idx) => idx * 10,
        }
      ],
      animationEasing: 'elasticOut',
      animationDelayUpdate: (idx) => idx * 5,
    };
  }

  /*///////////////////// SUSCRIPCIÓNES SUPERIORES /////////////////////*/

   /* barras 0 */
   suscripciones_superiores_barras_1_func(){

    console.log();

    //this.arrMetodoUsuSuperiores[0] = res['totalUsuarios'][0].totalUsuarios;
    //this.arrMetodoUsuSuperiores[1] = res['usuarioSuperiores'][0].usuarioSuperiores;
    //this.arrMetodoUsuSuperiores[2] = res['usuariosPremium'][0].usuariosPremium;
    //this.arrMetodoUsuSuperiores[3] = res['usuariosPremiumPlus'][0].usuariosPremiumPlus;
    //this.arrMetodoUsuSuperiores[4] = res['usuariosPremiumUltra'][0].usuariosPremiumUltra;

    const numero= [];

    for(let i=0;i<5;i++){
      numero.push(this.arrMetodoUsuSuperiores[i] as never);
    }

    this.suscripciones_superiores_barras_1 = {
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
        data: ['Total', 'Superiores', 'Premium', 'Premium Plus', 'Premium Ultra']
      },
      series: [
        {
          color: '#0073ca',
          name: 'Tipo suscripcion',
          type: 'bar',
          data: numero
        }
      ]
    };
  }

  /*///////////////////// REPERCUSION MODELO /////////////////////*/
  getMaxRpercusion(): Number{
    let max = 0;
    for (let i = 0; i < this.arrMetodoModMasRep_1.length ; i++) {
        if(this.arrMetodoModMasRep_1[0][i].valor > max){
          max = this.arrMetodoModMasRep_1[0][i].valor;
        }
    }
    return max;
  }

  /* cantidad 1 */
  repercusion_modelo_velocidad_1_func(){

    this.repercusion_modelo_velocidad_1 = {
      series: [
        {
          color: '#0073ca',
          min: 0,
          max: this.getMaxRpercusion(),
          splitNumber: 0,
          type: 'gauge',
          progress: {
            show: true,
            width: 5
          },
          axisLine: {
            lineStyle: {
              width: 5
            }
          },
          axisTick: {
            show: false
          },
          splitLine: {
            length: 15,
            lineStyle: {
              width: 2,
              color: 'white'
            }
          },
          axisLabel: {
            distance: 25,
            color: 'white',
            fontSize: 5
          },
          anchor: {
            show: true,
            showAbove: true,
            size: 10,
            itemStyle: {
              borderWidth: 5
            }
          },
          title: {
            show: false
          },
          detail: {
            valueAnimation: true,
            fontSize: 20,
            offsetCenter: [0, '120%']
          },
          data: [
            {
              value: this.arrMetodoModMasRep_1[0][0].valor,
              color: '#0073ca'
            }
          ]
        }
      ]
    };
  }


  /* cantidad 1 */
  repercusion_modelo_velocidad_2_func(){
    this.repercusion_modelo_velocidad_2 = {
      series: [
        {
          color: '#0073ca',
          min: 0,
          max: this.getMaxRpercusion(),
          splitNumber: 0,
          type: 'gauge',
          progress: {
            show: true,
            width: 5
          },
          axisLine: {
            lineStyle: {
              width: 5
            }
          },
          axisTick: {
            show: false
          },
          splitLine: {
            length: 15,
            lineStyle: {
              width: 2,
              color: 'white'
            }
          },
          axisLabel: {
            distance: 25,
            color: 'white',
            fontSize: 5
          },
          anchor: {
            show: true,
            showAbove: true,
            size: 10,
            itemStyle: {
              borderWidth: 5
            }
          },
          title: {
            show: false
          },
          detail: {
            valueAnimation: true,
            fontSize: 20,
            offsetCenter: [0, '120%']
          },
          data: [
            {
              value: this.arrMetodoModMasRep_1[0][1].valor,
              color: '#0073ca'
            }
          ]
        }
      ]
    };
  }



  /* cantidad 3 */
  repercusion_modelo_velocidad_3_func(){

    console.log(this.arrMetodoModMasRep[2]);

    this.repercusion_modelo_velocidad_3 = {
      series: [
        {
          color: '#0073ca',
          min: 0,
          max: this.getMaxRpercusion(),
          splitNumber: 0,
          type: 'gauge',
          progress: {
            show: true,
            width: 5
          },
          axisLine: {
            lineStyle: {
              width: 5
            }
          },
          axisTick: {
            show: false
          },
          splitLine: {
            length: 15,
            lineStyle: {
              width: 2,
              color: 'white'
            }
          },
          axisLabel: {
            distance: 25,
            color: 'white',
            fontSize: 5
          },
          anchor: {
            show: true,
            showAbove: true,
            size: 10,
            itemStyle: {
              borderWidth: 5
            }
          },
          title: {
            show: false
          },
          detail: {
            valueAnimation: true,
            fontSize: 20,
            offsetCenter: [0, '120%']
          },
          data: [
            {
              value: this.arrMetodoModMasRep_1[0][2].valor,
              color: '#0073ca'
            }
          ]
        }
      ]
    };
  }


  /* barras 1 */
  repercusion_modelo_barras_1_func(){
    const dataAxis = [
      'Usuario 1',
      'Usuario 2',
      'Usuario 3',
      'D',
      'E',
      'F',
      'G',
      'H',
      'I',
      'J',
      'K',
      'L',
      'M',
      'N',
      'O',
      'P',
      'Q',
      'R',
      'S',
      'T',
    ];
    const data = [
      220,
      182,
      191,
      234,
      290,
      330,
      310,
      123,
      442,
      321,
      90,
      149,
      210,
      122,
      133,
      334,
      198,
      123,
      125,
      220,
    ];
    const yMax = 500;
    const dataShadow = [];

    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < data.length; i++) {
      dataShadow.push(yMax as never);
    }

    this.repercusion_modelo_barras_1 = {
      title: {
        text: '',
      },
      xAxis: {
        data: dataAxis,
        axisLabel: {
          inside: true,
          color: '#fff',
        },
        axisTick: {
          show: false,
        },
        axisLine: {
          show: false,
        },
        z: 10,
      },
      yAxis: {
        axisLine: {
          show: false,
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          color: '#999',
        },
      },
      dataZoom: [
        {
          type: 'inside',
        },
      ],
      series: [

        {
          // For shadow
          type: 'bar',
          itemStyle: {
            color: '#0073ca',
          },
          color: '#0073ca',
          barGap: '-100%',
          barCategoryGap: '40%',
          data: dataShadow,
          animation: false,
        },
        {
          type: 'bar',
          itemStyle: {
            color: new LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#0073ca' },
              { offset: 0.5, color: '#0073ca' },
              { offset: 1, color: '#0073ca' },
            ]),
          },
          emphasis: {
            itemStyle: {
              color: new LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#0073ca' },
                { offset: 0.7, color: '#0073ca' },
                { offset: 1, color: '#0073ca' },
              ]),
            }
          },
          data,
        },
      ],
    };
  }

  /*///////////////////// USUARIOS CONVERSACIONES /////////////////////*/
  getMaxNumConversaciones(): Number{
    let max = 0;
    for (let i = 0; i < this.arrConversaciones.length ; i++) {
        if(this.arrConversaciones[0][i].numero_conversaciones > max){
          max = this.arrConversaciones[0][i].numero_conversaciones;
        }
    }
    return max;
  }
  /* tarta 2 */
  usuarios_conversaciones_barras_1_func(){
    const gaugeData = [
      {
        value: this.arrConversaciones[0][0].numero_conversaciones,
        name: this.arrConversaciones[0][0].nombre_usuario,
        color: '#0073ca',
        title: {
          offsetCenter: ['0%', '-30%']
        },
        detail: {
          valueAnimation: true,
          offsetCenter: ['0%', '-20%']
        }
      },
      {
        value: this.arrConversaciones[0][1].numero_conversaciones,
        name: this.arrConversaciones[0][1].nombre_usuario,
        color: '#0073ca',
        title: {
          offsetCenter: ['0%', '0%']
        },
        detail: {
          valueAnimation: true,
          offsetCenter: ['0%', '10%']
        }
      },
      {
        value: this.arrConversaciones[0][2].numero_conversaciones,
        name: this.arrConversaciones[0][2].nombre_usuario,
        color: '#0073ca',
        title: {
          offsetCenter: ['0%', '30%']
        },
        detail: {
          valueAnimation: true,
          offsetCenter: ['0%', '40%']
        }
      }
    ];
    this.usuarios_conversaciones_barras_1 = {
      series: [
        {
          max: this.getMaxNumConversaciones(),
          color: '#0073ca',
          type: 'gauge',
          startAngle: 90,
          endAngle: -270,
          pointer: {
            show: false
          },
          progress: {
            color: '#0073ca',
            show: true,
            overlap: false,
            roundCap: true,
            clip: false,
            itemStyle: {
              borderWidth: 1,
              borderColor: 'white'
            }
          },
          axisLine: {
            lineStyle: {
              width: 25
            }
          },
          splitLine: {
            show: false,
            distance: 10,
            length: 15
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            show: false,
            distance: 70
          },
          data: gaugeData,
          title: {
            fontSize: 16,
            width: 30
          },
          detail: {
            width: 50,
            height: 30,
            fontSize: 12,
            color: 'inherit',
            borderColor: '',
            borderRadius: 20,
            borderWidth: 3,
            formatter: '{value} conv'
          }
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


}
