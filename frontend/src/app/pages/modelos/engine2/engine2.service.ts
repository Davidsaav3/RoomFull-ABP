import { Injectable } from "@angular/core";
import * as glMatrix  from "gl-matrix";
import { TNodo } from "./engine-components/TNodo";
import { HttpClient } from '@angular/common/http';
import { EscenaService } from '../../../services/escena.service';
import { TModelo } from "./engine-components/entidades/TModelo";
import { TGestorRecurso } from './engine-components/recursos/TGestorRecurso';
import { TCamara } from './engine-components/entidades/TCamara';
import { UiEventsService } from "../ui/uiEvents.service";
import { TLuz } from "./engine-components/entidades/TLuz";

@Injectable({providedIn: 'root'})
export class Engine2Service{

  private canvas: HTMLCanvasElement;

  pagina:string = "normal";


  deltaTime = 0;

  //VAriables para la camara

  camera : TCamara;

  private gestorRecursos : TGestorRecurso;

  private scene : TNodo;

  private glaux : WebGL2RenderingContext | null;

  nodoBuffers: Object[] = [];

  nuevosHijos: any[][] = [];

  nuevosBuffers: any[] = [];

  ambienteColor = 0;s

  fondo = 0;

  token:string;

  //Public variable de carga
  private loading : boolean = true;

  width

  height

  public constructor(private http : HttpClient, private escenaService: EscenaService, private uiEventsService: UiEventsService){
    this.gestorRecursos = new TGestorRecurso(this.escenaService);



    this.uiEventsService.guardarPuntoCurrent.subscribe(bool => {

     if(bool){
      this.anadirpunto();
      this.uiEventsService.changeGuardarPunto(false);
     }

    });

    this.uiEventsService.puntoAlQueIrCurrent.subscribe(idPunto => {

      if(idPunto != -1){
       this.iralpunto(idPunto);
       this.uiEventsService.changePuntoAlQueIr(-1);
      }

     });

     this.uiEventsService.puntoQueEliminarCurrent.subscribe(idPunto => {

      if(idPunto != -1){
       this.eliminarpunto(idPunto);
       this.uiEventsService.changePuntoQueEliminar(-1);
      }

     });

     this.uiEventsService.hacerRecorridoCurrent.subscribe(bool => {
        this.hacerRecorrido(bool);
     });

     this.uiEventsService.colorAmbienteCurrent.subscribe(valor => {
        this.ambienteColor = valor;
     });

     this.uiEventsService.fondoCurrent.subscribe(valor => {
        this.fondo = valor;
     });
  }

  createScene(canvas? : HTMLCanvasElement){
    this.scene = new TNodo('Escena');
    if(canvas){
      this.canvas = canvas;


      switch(this.pagina){

        case "normal":
          {

            this.canvas.width = document.documentElement.clientWidth;
            this.canvas.height = document.documentElement.clientHeight * 0.9 ;
            break;
          }
        case "landing":
          {
            this.canvas.width = document.documentElement.clientWidth;
            this.canvas.height = document.documentElement.clientHeight * 0.9 ;
            break;
          }
        case "privado":
          {
            this.canvas.width = document.documentElement.clientWidth;
            this.canvas.height = document.documentElement.clientHeight;
            break;
          }
          case "subir":
            {
              this.canvas.width = document.documentElement.clientWidth;
              this.canvas.height = document.documentElement.clientHeight * 0.9 ;
              break;
            }
            default:
              {

                this.canvas.width = document.documentElement.clientWidth;
                this.canvas.height = document.documentElement.clientHeight * 0.9 ;
                break;
              };
      }



      let a = this.canvas.getContext("webgl2");
      if( a != null){
        this.glaux = this.canvas.getContext("webgl2");
        this.width = this.canvas.width;
        this.height = this.canvas.height;
      }

    }
  }

  createCamera(aspectWidth , aspectHeight, near, far, fov){
    const nodeCamera = new TNodo('camera');
    this.camera = new TCamara(aspectWidth , aspectHeight, near, far, fov, true,this.uiEventsService,);
    this.camera.setFlyControls(this.canvas);
    nodeCamera.setEntidad(this.camera);

    this.scene.addHijo(nodeCamera);

    this.uiEventsService.puntosCurrent.subscribe(puntos => {

      if(puntos.length > 0  ){
        let posis : glMatrix.vec3[] = [];
        let dir : glMatrix.vec2[] = [];

        puntos.forEach((punto:any)=>{
          posis.push(glMatrix.vec3.fromValues(punto['posicion'].split(',')[0],punto['posicion'].split(',')[1],punto['posicion'].split(',')[2]))
          dir.push(glMatrix.vec2.fromValues(punto['direccion'].split(',')[0],punto['direccion'].split(',')[1]))
        })

        console.log(posis,dir)

        this.camera.addPuntos(posis,dir);
      }

    });
  }

  printScene(){
    console.log(this.scene);
  }

  async addGLTF2Scene(name:string){

  if(name!=''){

    var auxLoader = <TNodo[]>await this.gestorRecursos.loadGLTF(name).then(nodos =>{
      //console.log(nodos);
      nodos.forEach((nodo:TNodo)=>{
        this.scene.addHijo(nodo);
      if(nodo.entidad instanceof TModelo){
        this.nodoBuffers.push(nodo.entidad.getBuffers(this.glaux));
      }


    })
  });

  }

}

  async run(){
    // Initialize the GL context
    if(this.canvas){
      const gl = this.canvas.getContext("webgl2");

      // Only continue if WebGL is available and working
      if (gl === null) {
        alert(
          "Unable to initialize WebGL. Your browser or machine may not support it."
        );
        return;
      }

      // Set clear color to black, fully opaque
      gl.clearColor(0.0, 0.0, 0.0, 1.0);
      // Clear the color buffer with specified clear color
      gl.clear(gl.COLOR_BUFFER_BIT);



      var shaderProgramL = <WebGLProgram>await this.setShaders(gl, "lightFS.frag", "lightVS.vert");

      const programInfoLight = {
        program: shaderProgramL,
        attribLocations: {
          vertexPosition: gl.getAttribLocation(shaderProgramL, "aVertexPosition"),
          vertexNormal: gl.getAttribLocation(shaderProgramL, "aVertexNormal")
        },
        uniformLocations: {
          projectionMatrix: gl.getUniformLocation(shaderProgramL, "uProjectionMatrix"),
          modelViewMatrix: gl.getUniformLocation(shaderProgramL, "uModelViewMatrix"),
          normalMatrix: gl.getUniformLocation(shaderProgramL, "uNormalMatrix"),
          uSampler: gl.getUniformLocation(shaderProgramL, "uSampler"),
        },
      };


      var shaderProgram = <WebGLProgram>await this.setShaders(gl, "fragmentShader.frag", "vertexShader.vert");
      console.log(gl.getProgramInfoLog(shaderProgram))
      const programInfoObject = {
        program: shaderProgram,
        attribLocations: {
          vertexPosition: gl.getAttribLocation(shaderProgram, "aVertexPosition"),
          vertexNormal: gl.getAttribLocation(shaderProgram, "aVertexNormal"),
          textureCoord: gl.getAttribLocation(shaderProgram, "aTextureCoord")
        },
        uniformLocations: {
          projectionMatrix: gl.getUniformLocation(shaderProgram, "uProjectionMatrix"),
          modelViewMatrix: gl.getUniformLocation(shaderProgram, "uModelViewMatrix"),
          normalMatrix: gl.getUniformLocation(shaderProgram, "uNormalMatrix"),
          lightsPositions:  gl.getUniformLocation(shaderProgram, "ulightsPositions"),
          cameraPosition:  gl.getUniformLocation(shaderProgram, "uCameraPosition"),
          lightColor:  gl.getUniformLocation(shaderProgram, "lightColor"),
          uSampler: gl.getUniformLocation(shaderProgram, "uSampler")

        },
      };

      var shaderProgramS = <WebGLProgram>await this.setShaders(gl, "fragmentShadowShader.frag", "vertexShadowShader.vert");

      const programInfoShadow = {
        program: shaderProgramS,
        attribLocations: {
          vertexPosition: gl.getAttribLocation(shaderProgramS, "aVertexPosition"),
          vertexNormal: gl.getAttribLocation(shaderProgramS, "aVertexNormal"),
          textureCoord: gl.getAttribLocation(shaderProgramS, "aTextureCoord"),
        },
        uniformLocations: {
          projectionMatrix: gl.getUniformLocation(shaderProgramS, "uProjectionMatrix"),
          modelViewMatrix: gl.getUniformLocation(shaderProgramS, "uModelViewMatrix"),
          normalMatrix: gl.getUniformLocation(shaderProgramS, "uNormalMatrix"),
          uSampler: gl.getUniformLocation(shaderProgramS, "uShadowMapTransformMatrix"),
        },
      };

       // variable que guarda todos los buffers, ¡¡Los buffers se añaden cuando se añaden los objetos!!
/*
      const totalchild = this.scene.hijos.length;

      this.scene.hijos.forEach((nodo:TNodo, index:number)=>{
          console.log('Quedan',totalchild-index)
          if(nodo.entidad instanceof TModelo){

            this.nodoBuffers.push(nodo.entidad.getBuffers(gl));

          }
        }) */


        this.gestorRecursos.loadCosasDeLaEscena().then(nodos =>{
          nodos.forEach((nodo:TNodo)=>{
            this.scene.addHijo(nodo);
            if(nodo.entidad instanceof TModelo){

              this.nodoBuffers.push(nodo.entidad.getBuffers(gl));

            } else if(nodo.entidad instanceof TLuz){
              this.nodoBuffers.push(nodo.entidad.getBuffers(gl));
            }

            }

          )


          this.createCamera( gl.canvas.width , gl.canvas.height, 0.1, 2000,(45 * Math.PI) / 180);

          let then = 0;

          // Draw the scene repeatedly
          var render = async (now:any) => {

            //await this.addnew();

            gl.viewport(0,0,this.width, this.height )
            now *= 0.001; // convert to seconds
            this.deltaTime = now - then;
            then = now;

            this.drawScene(gl, programInfoObject, programInfoLight, programInfoShadow, this.nodoBuffers);

            this.camera.setDeltaTime(this.deltaTime);
            // ya no esta como private camera: TCamara


            //esto para hacer que rote solo lo que sea --> this.squareRotation += this.deltaTime;

            requestAnimationFrame(render);
          }
          requestAnimationFrame(render);
      })



    }
  }


  drawScene(gl, programInfoObject, programInfoLight, programInfoShadow, nodoBuffers) {
    gl.clearColor(0.2, 0.2, 0.2, 1.0); // Clear to black, fully opaque
    gl.clearDepth(1.0); // Clear everything
    gl.enable(gl.DEPTH_TEST); // Enable depth testing
    gl.depthFunc(gl.LEQUAL); // Near things obscure far things

    // Clear the canvas before we start drawing on it.

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);


    let viewProyectionMatrix : glMatrix.mat4 | undefined = undefined;
    //Pilla la viewMatrixProyection de la camara
    this.scene.hijos.forEach((nodo:TNodo)=>{
      if(nodo.entidad instanceof TCamara){
        viewProyectionMatrix = nodo.entidad.getviewProjectionMatrix();
      }
    })

    //Recorrer todos los hijos de la scena para dibujar
    //console.log(viewProyectionMatrix)

    if(viewProyectionMatrix!=undefined){

      for (let i = 0; i< this.scene.hijos.length ; i++){
        this.scene.hijos[i].draw(gl,nodoBuffers[i],programInfoObject, programInfoLight , programInfoShadow, viewProyectionMatrix, this.scene.getPosicionesLucesHijas(), this.camera.getPosition(), this.ambienteColor, this.fondo);
      }
      /* this.scene.hijos.forEach((nodoHijo: TNodo, index: number)=>{
        if(nodoHijo.entidad instanceof TModelo){

          nodoHijo.draw(gl,nodoBuffers[index],programInfoObject, programInfoLight , viewProyectionMatrix);

        }
      }) */
    }

  }




 // Metodo para asignar shaders
  setShaders(gl: WebGLRenderingContextBase, fragS, vertexS) {
    return new  Promise (resolve =>{
      var vShaderId, fShaderId, programId;
      let vShaderCode = '';
      let fShaderCode = '';

    // Crear Shaders
    vShaderId = gl.createShader(gl.VERTEX_SHADER);
    fShaderId = gl.createShader(gl.FRAGMENT_SHADER);

    this.token = localStorage.getItem('token') || '';


    // Leer los ficheros y definirlos como fuentes
      if (this.token){
        this.escenaService.cargarContenidoShader(vertexS).subscribe({
          next:((res : any)=>{
            vShaderCode = res.content;
            this.escenaService.cargarContenidoShader(fragS).subscribe({
              next:((res : any)=>{
                fShaderCode = res.content;

                gl.shaderSource(vShaderId, vShaderCode);
                gl.shaderSource(fShaderId, fShaderCode);

                // Compilar los shaders
                gl.compileShader(vShaderId);
                gl.compileShader(fShaderId);

                console.log(gl.getShaderParameter(vShaderId,gl.COMPILE_STATUS))

                // CREAR PROGRAMA, ASOCIAR SHADERS Y ENLAZARLO TODO
                programId = gl.createProgram();
                gl.attachShader(programId, fShaderId);
                gl.attachShader(programId, vShaderId);
                gl.linkProgram(programId);

                // BORRAMOS LOS SHADERS UNA VEZ CREADO EL PROGRAMA
                gl.deleteShader(vShaderId);
                gl.deleteShader(fShaderId);

                // AHORA SE PUEDE USAR EN CUALQUIER MOMENTO
                //gl.useProgram(programId);
                resolve( programId);
              })
            });
          })
        });
      }
      else {
        this.escenaService.cargarContenidoShaderNoToken(vertexS).subscribe({
          next:((res : any)=>{
            vShaderCode = res.content;
            this.escenaService.cargarContenidoShaderNoToken(fragS).subscribe({
              next:((res : any)=>{
                fShaderCode = res.content;

                gl.shaderSource(vShaderId, vShaderCode);
                gl.shaderSource(fShaderId, fShaderCode);

                // Compilar los shaders
                gl.compileShader(vShaderId);
                gl.compileShader(fShaderId);

                console.log(gl.getShaderParameter(vShaderId,gl.COMPILE_STATUS))

                // CREAR PROGRAMA, ASOCIAR SHADERS Y ENLAZARLO TODO
                programId = gl.createProgram();
                gl.attachShader(programId, fShaderId);
                gl.attachShader(programId, vShaderId);
                gl.linkProgram(programId);

                // BORRAMOS LOS SHADERS UNA VEZ CREADO EL PROGRAMA
                gl.deleteShader(vShaderId);
                gl.deleteShader(fShaderId);

                // AHORA SE PUEDE USAR EN CUALQUIER MOMENTO
                //gl.useProgram(programId);
                resolve( programId);
              })
            });
          })
        });
      }


    })

  }

//Metodos para probar el arbol de la escena
  public checkSceneTreeTransformations(){
    const nodo1 = new TNodo();
    const nodo2 = new TNodo();

    nodo1.addHijo(nodo2);

    nodo2.trasladar(glMatrix.vec3.fromValues(1,2,3));

    nodo1.rotar(glMatrix.vec3.fromValues(Math.PI,0,0));

    nodo1.trasladar(glMatrix.vec3.fromValues(2,2,2));

    nodo1.recorrer(glMatrix.mat4.create());

    console.log(nodo2)
  }

  public checkSceneTreeChildAddRemove(){
    const nodo1 = new TNodo();
    const nodo2 = new TNodo();
    const nodo3 = new TNodo();

    nodo3.trasladar(glMatrix.vec3.fromValues(1,1,1));

    nodo1.addHijo(nodo2);

    nodo1.addHijo(nodo3);

    console.log(nodo1.hijos);

    nodo1.removeHijo(nodo3);

    console.log(nodo1);
  }


  getpuntos(){

    let puntos = this.camera.getPuntos();
    let arrayString : string[] = [];

    puntos.forEach(element => {
      let string = "(" + element[0].toFixed(2) + "," + element[1].toFixed(2) + "," + element[2].toFixed(2) + ")";
      arrayString.push(string);
    });

    return arrayString;
  }

  anadirpunto(){
    let punto = this.camera.setPunto();

    this.uiEventsService.changePuntoQueGuardar(punto);
  }

  iralpunto(index : number){
    console.log(index)
    this.camera.translateToPoint(index);
  }

  eliminarpunto(index : number){
    console.log(index)
    this.camera.eliminarPunto(index);
  }

  cambiaVelocidad(speed){
    this.camera.cambiaVelocidad(speed);
  }

  hacerRecorrido(bool){
    if(this.camera){
      this.camera.iniciarRecorrido(bool);
    }

  }

  resize(){
    const canvas = document.getElementById('renderCanvas') as HTMLCanvasElement;
    if(canvas){



      switch(this.pagina){

        case "normal":
          {

            this.canvas.width = document.documentElement.clientWidth;
            this.canvas.height = document.documentElement.clientHeight * 0.9 ;
            break;
          }
        case "landing":
          {
            this.canvas.width = document.documentElement.clientWidth;
            this.canvas.height = document.documentElement.clientHeight * 0.9 ;
            break;
          }
        case "privado":
          {
            this.canvas.width = document.documentElement.clientWidth;
            this.canvas.height = document.documentElement.clientHeight;
            break;
          }
          case "subir":
            {
              this.canvas.width = document.documentElement.clientWidth;
              this.canvas.height = document.documentElement.clientHeight * 0.9 ;
              break;
            }
            default:
              {

                this.canvas.width = document.documentElement.clientWidth;
                this.canvas.height = document.documentElement.clientHeight * 0.9 ;
                break;
              };
      }

      const width = this.canvas.width;
      const height = this.canvas.height;

      if(this.scene != undefined &&  this.camera!= undefined){

        this.camera.setPerspectiva(undefined,undefined,undefined, width / height );

        canvas.width = width;
        canvas.height = height;

        this.width = canvas.width;
        this.height = canvas.height;
      }
  }

}

addnew(){
  return new  Promise<void> (resolve =>{
  if(this.nuevosHijos.length>0){
    for(let i = 0; i<this.nuevosHijos.length; i++){
      this.scene.addHijo(this.nuevosHijos[i][0]);
      this.nodoBuffers.push(this.nuevosHijos[i][1]);
    }
  }

  resolve()
  })
}

}

