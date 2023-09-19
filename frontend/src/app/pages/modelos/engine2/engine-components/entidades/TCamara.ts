import * as glMatrix from "gl-matrix";
import { TEntidad } from "./TEntidad";
import { check } from 'express-validator';
import { Observable } from 'rxjs';
import { UiEventsService } from '../../../ui/uiEvents.service';

export class TCamara extends TEntidad{

  public esPerspectiva : boolean;

  private cercano : number;

  private lejano : number;

  private fieldOfView;

  private aspect;

  private zNear;

  private zFar;

  private projectionMatrix;




  private vTraslacion = glMatrix.vec3.fromValues(0,2,20); // camera initial position

  private cameraTarget = glMatrix.vec3.fromValues(0,0,0);

  private cameraFront = glMatrix.vec3.fromValues(0,0,-1);

  private cameraUp;

  private cameraDirection;

  private cameraRight;

  private cameraPosition;


  //Variables para la rotacion y moviemiento de la camara

  private deltaTime = 1;

  private lastX: any;

  private lastY: any;

  private firstMouse = true;

  private yaw = 270;

  private pitch = 0;

  private velocidad = 25;


  //guardado de puntos - traslacion

  private posicionesCamara : Array<glMatrix.vec3> = [];

  private fovsCamera : Array<number> = [];

  private distance = 100000000000000000 ;

  private trasladarBool : Boolean = false;

  private newPosition;

  private normVec2NewPos;

  // guardado de puntos - direccion
  private direccionesCamara : Array<glMatrix.vec2> = []; // [0] -> Yaw , [1] -> Pitch

  private direccionBool : Boolean = false;

  private newYawAndPitch;


  // Recorrido de puntos

  private puntoActual: number = -1;

  private descanso: number = 2;

  private descansado: number = 0;

  private hacerRecorrido: Boolean = false;

  private primerPunto: Boolean = true;

private uiservice



  public constructor(aspectWidth , aspectHeight, near, far, fov, esPerspectiva, uiservice : UiEventsService, traslacion?){
    super();

    // DE AQUI PARA ABAJO CREAR UNA ENTIDAD CAMARA
    this.uiservice = uiservice;

    this.fieldOfView = fov;
    this.aspect = aspectWidth / aspectHeight;
    this.zNear = near;
    this.zFar = far;
    this.projectionMatrix = glMatrix.mat4.create();

    if(traslacion != undefined)
    this.vTraslacion = traslacion;

    this.cameraPosition = this.vTraslacion;


    //getting camera direction with the target and the initial position.
    let vecAux = glMatrix.vec3.fromValues(this.cameraPosition[0]-this.cameraTarget[0],this.cameraPosition[1]-this.cameraTarget[1],this.cameraPosition[2]-this.cameraTarget[2])
    this.cameraDirection = glMatrix.vec3.normalize(glMatrix.vec3.create(), vecAux);

    this.cameraUp =  glMatrix.vec3.fromValues(0, 1, 0);

    this.cameraRight = glMatrix.vec3.normalize( glMatrix.vec3.create(), glMatrix.vec3.cross(glMatrix.vec3.create(), this.cameraUp, this.cameraDirection));

    if(esPerspectiva){
      this.setPerspectiva();
    }


  }

  public setPerspectiva (cercaN? : number, lejosN? : number, fov?: number, aspect?: number): void{
    //imagino espPerspectiva=true; this.cercano=cercaN; this.lejano=lejosN;
    // note: glmatrix.js always has the first argument
    // as the destination to receive the result.
    if(cercaN!=undefined && lejosN!=undefined){
      this.zNear = cercaN;
      this.zFar = lejosN;
    }

    if(fov!=undefined){
      this.fieldOfView = fov;
    }

    if(aspect!=undefined){
      this.aspect = aspect;
    }

    this.projectionMatrix = glMatrix.mat4.perspective(glMatrix.mat4.create(), this.fieldOfView, this.aspect, this.zNear, this.zFar);



  };

  public setParalela (cercaN : number, lejosN : number): void{
    //imagino espPerspectiva=false; this.cercano=cercaN; this.lejano=lejosN;
  };

  public override dibujar(mat4: glMatrix.mat4): void {

  }

  getviewProjectionMatrix(){

    var cameraMatrix = glMatrix.mat4.create();

    let unoBool = false;

    let dosBool = false;

    if(this.hacerRecorrido){

      if(this.checkPosition(this.newPosition)){
        this.interpolate2Point();
      } else{
        unoBool = true;
      }

      if(this.interpolateYawPitch()){
        dosBool = true;
      }

      if(unoBool && dosBool){
       if(this.descansado < this.descanso){
          this.descansado += this.deltaTime*1;
       } else {
        this.descansado = 0;
        this.puntoActual+=1;
          if( this.puntoActual >= this.posicionesCamara.length ){
            this.puntoActual = -1;
            this.hacerRecorrido = false;
            this.primerPunto = true;
            this.uiservice.changeHacerRecorrido(false);

          } else{
            this.recorrerDatosDelPunto();
          }
       }
      }
    }

    //interpolacion para los puntos - traslacion
   if(this.trasladarBool){
    if(this.checkPosition(this.newPosition)){

      this.interpolate2Point();
    } else {
      this.trasladarBool = false;
    }
   }

   //interpolacion para los puntos - direccion

    if(this.direccionBool){
    if(this.interpolateYawPitch()){
      this.direccionBool = false;
    }
   }


    let vecPosPlusFront = glMatrix.vec3.add(glMatrix.vec3.create(),this.cameraPosition, this.cameraFront);

    cameraMatrix = glMatrix.mat4.lookAt(glMatrix.mat4.create(), this.cameraPosition, vecPosPlusFront, this.cameraUp);

    // Compute a view projection matrix
    var viewProjectionMatrix =  glMatrix.mat4.create();
    viewProjectionMatrix = glMatrix.mat4.multiply(glMatrix.mat4.create(),this.projectionMatrix, cameraMatrix);

    return viewProjectionMatrix;
  }



  rotateCamera( cameraMatrix , xRot, yRot){

    cameraMatrix = glMatrix.mat4.rotateY(cameraMatrix, cameraMatrix, yRot);
    cameraMatrix = glMatrix.mat4.rotateX(cameraMatrix, cameraMatrix, xRot);
    return cameraMatrix;

  }


  setDeltaTime (value){
    this.deltaTime = value;
  }

  cambiaVelocidad(speed){
    this.velocidad = speed;
  }

  setFlyControls(canvas : HTMLCanvasElement){

    document.addEventListener('keydown', (event) => {
      var name = event.key;
      var code = event.code;
      // Alert the key name and key code on keydown
      //console.log(`Key pressed ${name} \r\n Key code value: ${code}`);
  /*     console.log( 'camera postiion ',this.cameraPosition[0] + ',' + this.cameraPosition[1] + ',' + this.cameraPosition[2])
      console.log('camera frton ',this.cameraFront[0] + ',' + this.cameraFront[1] + ',' + this.cameraFront[2]) */



      let cameraSpeed = this.velocidad * this.deltaTime;

      switch(code){
        case'KeyW':{
          //palante


          this.cameraPosition = glMatrix.vec3.add(glMatrix.vec3.create(), this.cameraPosition , glMatrix.vec3.scale(glMatrix.vec3.create(), this.cameraFront, cameraSpeed));

          break;
        }
        case'KeyS':{

          //patras
          this.cameraPosition = glMatrix.vec3.subtract(glMatrix.vec3.create(), this.cameraPosition , glMatrix.vec3.scale(glMatrix.vec3.create(), this.cameraFront, cameraSpeed));

          break;
        }
        case'KeyA':{
          //palao
          let vecNormalized = glMatrix.vec3.normalize(glMatrix.vec3.create(), glMatrix.vec3.cross(glMatrix.vec3.create(), this.cameraFront, this.cameraUp));

          this.cameraPosition = glMatrix.vec3.subtract(glMatrix.vec3.create(), this.cameraPosition , glMatrix.vec3.scale(glMatrix.vec3.create(), vecNormalized, cameraSpeed));

          break;
        }
        case'KeyD':{
          //palotro
          let vecNormalized = glMatrix.vec3.normalize(glMatrix.vec3.create(), glMatrix.vec3.cross(glMatrix.vec3.create(), this.cameraFront, this.cameraUp));

          this.cameraPosition = glMatrix.vec3.add(glMatrix.vec3.create(), this.cameraPosition , glMatrix.vec3.scale(glMatrix.vec3.create(), vecNormalized, cameraSpeed));

          break;
        }

        case'KeyQ':{
          //parriba
          this.cameraPosition = glMatrix.vec3.add(glMatrix.vec3.create(), this.cameraPosition , glMatrix.vec3.scale(glMatrix.vec3.create(), this.cameraUp, cameraSpeed));

          break;
        }
        case'KeyE':{
          //pabajo
          this.cameraPosition = glMatrix.vec3.subtract(glMatrix.vec3.create(), this.cameraPosition , glMatrix.vec3.scale(glMatrix.vec3.create(), this.cameraUp, cameraSpeed));

          break;
        }


      }
    }, false);

    // get canvas relative and distance methods
    var getCanvasRelative = function (e) {

      var canvas = e.target,
      bx = canvas.getBoundingClientRect();
      return {
          x: (e.changedTouches ? e.changedTouches[0].clientY : e.clientY) - bx.top,
          y: (e.changedTouches ? e.changedTouches[0].clientX : e.clientX) - bx.left,
          bx: bx
      };
    };

    var distance = function (x1, y1, x2, y2) {
      return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
    };

    // Event handlers
    var pointerDown = function (state) {
      return function (e) {
          var pos = getCanvasRelative(e);
          if (distance(pos.x, pos.y, state.x, state.y) <= state.r) {
              state.down = true;
          }
      };
    };


    var pointerMove = (state) =>{
      return  (e) =>{
          var pos = getCanvasRelative(e);
          if (state.down) {



              if (this.firstMouse)
              {
                  this.lastX = pos.x;
                  this.lastY = pos.y;
                  this.firstMouse = false;
              }

              let xoffset = pos.x - this.lastX;
              let yoffset = this.lastY - pos.y;

              this.lastX = pos.x;
              this.lastY = pos.y;

              //console.log('posx', xoffset)
              //console.log('posy', yoffset)

              let sensitivity = 0.1;

              xoffset *= sensitivity;
              yoffset *= sensitivity;

              this.yaw   += yoffset;
              this.pitch += xoffset;


              if(this.pitch > 89.0)
              this.pitch = 89.0;

              if(this.pitch < -89.0)
              this.pitch = -89.0;

              //console.log(this.pitch);
              //console.log(this.yaw);

              let direction = glMatrix.vec3.create() ;

              direction[0] = Math.cos(this.getRadians(this.yaw)) * Math.cos(this.getRadians(this.pitch));

              direction[1] = Math.sin(this.getRadians(this.pitch));

              direction[2] = Math.sin(this.getRadians(this.yaw)) * Math.cos(this.getRadians(this.pitch));

              this.cameraFront = glMatrix.vec3.normalize(glMatrix.vec3.create(),direction);


          }
      };
    };


    var pointerUp = (state)  =>{
        return  (e) => {
                state.down = false;
                this.firstMouse = true;
            };
          };


    var pointerScroll =  (state) => {
      return  (e) => {
        let fov = this.getDegrees(this.fieldOfView);

        let aux = 0;

        if(e.deltaY < 0){
          aux = 1;
        } else {
          aux = -1;
        }

        fov -= aux;
        if (fov < 1.0)
          fov = 1.0;
        if (fov > 75.0)
          fov = 75.0;

        this.setPerspectiva(undefined, undefined, this.getRadians(fov))
        e.preventDefault();
      };
    };

    var state = {
      x: canvas.width / 2,
      y: canvas.height / 2,
      r: 4000,
      down: false
    };


    canvas.addEventListener('mousedown', pointerDown(state));
    canvas.addEventListener('mousemove', pointerMove(state));
    canvas.addEventListener('mouseup', pointerUp(state));
    canvas.addEventListener('touchstart', pointerDown(state));
    canvas.addEventListener('touchmove',pointerMove(state));
    canvas.addEventListener('touchend', pointerUp(state));
    canvas.addEventListener('wheel', pointerScroll(state));

  }


  //Math methods
  getRadians(degrees){

    return degrees * (Math.PI / 180);
  }


  getDegrees(radians){

    return 180 * (radians / Math.PI);
  }


  //Guardado de puntos

  setPunto(){
    const aux = this.cameraPosition;

    this.posicionesCamara.push(aux);
    this.direccionesCamara.push(glMatrix.vec2.fromValues(this.yaw, this.pitch));
    this.fovsCamera.push(this.getDegrees(this.fieldOfView));
    console.log('setpunto', this.posicionesCamara)

    let punto = [{
      "posicion": `${aux[0]},${aux[1]},${aux[2]}`,
      "direccion": `${this.yaw},${this.pitch}`,
      "nombre": `Punto: ${this.posicionesCamara.length}`
  }]
    return punto
  }

  getPuntos(){
    return this.posicionesCamara;
  }

  getPunto(index:number){
    return this.posicionesCamara[index];
  }

  translateToPoint(index:number){
    //Calculo de variables para la direccion a la que mira la camara (cameraFront)
    this.newYawAndPitch = this.direccionesCamara[index];

    //Calculo de variables para la traslacion de camara (cameraPosition)
    this.newPosition = this.posicionesCamara[index];
    this.normVec2NewPos = glMatrix.vec3.normalize(glMatrix.vec3.create() , glMatrix.vec3.subtract(glMatrix.vec3.create(), this.newPosition,  this.cameraPosition));

    this.trasladarBool = true;

    this.direccionBool = true;

    this.hacerRecorrido = false;

  }

  eliminarPunto(index:number) {
    this.posicionesCamara.splice(index, 1);
    this.direccionesCamara.splice(index, 1);
    this.fovsCamera.splice(index, 1);
  }

  interpolate2Point(){

    let cameraSpeed = this.velocidad * this.deltaTime ;

    this.cameraPosition = glMatrix.vec3.add(glMatrix.vec3.create(), this.cameraPosition , glMatrix.vec3.scale(glMatrix.vec3.create(), this.normVec2NewPos, cameraSpeed));

  }

  interpolateYawPitch(){
    let cameraSpeed = this.velocidad * this.deltaTime;

    // newYawAndPitch 0 -> yaw , 1 -> pitch

    let sensibilidad = 0.5;

    let salidaYaw = false;
    let salidaPitch = false;
    let salidaFinal = false;

    if(Math.abs(this.newYawAndPitch[0] - this.yaw) > sensibilidad){
      if(this.newYawAndPitch[0] > this.yaw){
        this.yaw+=cameraSpeed;
      } else{
        this.yaw-=cameraSpeed;
      }
    } else {
      salidaYaw = true;
    }


    if(Math.abs(this.newYawAndPitch[1] - this.pitch) > sensibilidad){
      if(this.newYawAndPitch[1] > this.pitch){
        this.pitch+=cameraSpeed;
      } else{
        this.pitch-=cameraSpeed;
      }
    } else{
      salidaPitch = true;
    }

    if(salidaPitch && salidaYaw){
      salidaFinal=true;
    }

    if(!salidaFinal){

      let direction = glMatrix.vec3.create() ;

      direction[0] = Math.cos(this.getRadians(this.yaw)) * Math.cos(this.getRadians(this.pitch));

      direction[1] = Math.sin(this.getRadians(this.pitch));

      direction[2] = Math.sin(this.getRadians(this.yaw)) * Math.cos(this.getRadians(this.pitch));

      this.cameraFront = glMatrix.vec3.normalize(glMatrix.vec3.create(),direction);

    }

    return salidaFinal
  }

  checkPosition(targetPos){

    const dist = glMatrix.vec3.dist( targetPos ,this.cameraPosition)

    if(this.distance > dist){
      this.distance = dist;
    }

    if(this.distance < 1){
      this.distance = 1000000000000000000000
      return false
    } else {
      return true
    }
  }


  addPuntos (posi : Array<glMatrix.vec3> , dir : Array<glMatrix.vec2> ){

    this.posicionesCamara = this.posicionesCamara.concat( posi);

    console.log(this.posicionesCamara);

    this.direccionesCamara = this.direccionesCamara.concat(dir);
    console.log(this.direccionesCamara);

  }


  recorrerDatosDelPunto(){

    let index = this.puntoActual.toString();
    //Calculo de variables para la direccion a la que mira la camara (cameraFront)
    this.newYawAndPitch = this.direccionesCamara[index];

    //Calculo de variables para la traslacion de camara (cameraPosition)
    this.newPosition = this.posicionesCamara[index];
    this.normVec2NewPos = glMatrix.vec3.normalize(glMatrix.vec3.create() , glMatrix.vec3.subtract(glMatrix.vec3.create(), this.newPosition,  this.cameraPosition));

    this.trasladarBool = false;

    this.direccionBool = false;

    this.hacerRecorrido = true;

  }


  iniciarRecorrido(bool){
    if(bool){
      this.hacerRecorrido = true;

    if(this.primerPunto){
      this.puntoActual = 0;
      this.recorrerDatosDelPunto()
      this.primerPunto = false;
    }
    } else{
      this.puntoActual = -1;
      this.hacerRecorrido = false;
      this.primerPunto = true;
      //this.uiservice.changeHacerRecorrido(false);
    }



  }


  getPosition(){
    return this.cameraPosition;
  }


}
