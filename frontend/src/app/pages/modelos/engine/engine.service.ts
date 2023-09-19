import * as THREE from 'three';
import { ElementRef, EventEmitter, Injectable, NgZone, OnDestroy, Output, OnInit } from '@angular/core';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { TextureLoader } from 'three';
import { NgControlStatus } from '@angular/forms';
import { DataService } from '../subir-modelo/data.service';
import { DataService2 } from '../editar-modelo/data2.service';

@Injectable({providedIn: 'root'})
export class EngineService {
  public state: string = '' ;

  @Output() cargado: EventEmitter<any> = new EventEmitter();

  private canvas: HTMLCanvasElement | undefined;
  private renderer: THREE.WebGLRenderer | undefined;
  private camera: THREE.PerspectiveCamera | undefined;
  private scene: THREE.Scene | undefined;
  private light: THREE.AmbientLight | undefined;
  private controlsOC: any;

  private initialAspect=[0,0] //width, heidht;

  private cube: THREE.Mesh | undefined;

  private frameId: number | undefined;

  private alphaChanger:boolean = false;

  message = '';
  public constructor(private ngZone: NgZone, private data:DataService, private data2:DataService2) {
    try{
      this.data.currentMessage.subscribe(message => {

        if(message != 'none' && message != '' ){
          this.message = message;
          this.cargarobjeto(message);
        }

      });
      this.data2.currentMessage.subscribe(message2 => {
        console.log(message2)
        if(message2 != 'none' && message2 != '' ){
          this.cargarobjeto(message2);
        }

      });

    } catch(e){
      console.log(e);
    }
  }

  public cambiarAlpha(aux:boolean){
    this.alphaChanger=aux;
  }

  public pararAnimacion(): void {
    if (this.frameId != null) {
      cancelAnimationFrame(this.frameId);
    }
  }

  public cambiarAutorrotate(aux: boolean){
    if( this.controlsOC)
    this.controlsOC.autoRotate=aux;
  }

  public createScene(canvas: ElementRef<HTMLCanvasElement>): void {
    // The first step is to get the reference of the canvas element from our HTML document
    this.canvas = canvas.nativeElement;

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: this.alphaChanger,    // transparent background
      antialias: true // smooth edges
    });

    switch(this.state){
      case 'landing' : {
      this.initialAspect = [document.documentElement.clientWidth ,document.documentElement.clientHeight]
      break;}
      case 'subirM' : {
      this.initialAspect = [document.documentElement.clientWidth *0.7,document.documentElement.clientHeight]
      break;}
      case 'verM' : {
      this.initialAspect = [document.documentElement.clientWidth ,document.documentElement.clientHeight]
      break;}
      case 'privM' : {
      this.initialAspect = [document.documentElement.clientWidth ,document.documentElement.clientHeight]
      break;}

    }


    //this.initialAspect = [this.canvas.clientWidth,this.canvas.clientWidth]

    //this.renderer.setSize(document.documentElement.clientWidth, document.documentElement.clientHeight * 0.90);
    this.renderer.setSize(document.documentElement.clientWidth, document.documentElement.clientHeight * 0.90);

    // create the scene
    this.scene = new THREE.Scene();
    if(!this.alphaChanger){
      this.scene.background = new THREE.Color( 'skyblue' );
    }


    // create camera
    this.camera = new THREE.PerspectiveCamera(
      75, this.initialAspect[0]/this.initialAspect[1], 0.1, 1000
    );
    this.camera.position.z = 11;
    this.camera.position.y = 6;
    this.camera.position.x = 8;
    this.scene.add(this.camera);

    // add grid
    const size = 30;
    const divisions = 10;

    const gridHelper = new THREE.GridHelper( size, divisions );
    if(!this.alphaChanger)
    this.scene.add( gridHelper );

    // add orbit controls to the camera

    this.controlsOC = new OrbitControls( this.camera, this.renderer.domElement );
    this.controlsOC.enableDamping=true;
    this.controlsOC.autoRotate=true;

    //controls with keys

   /*  this.controlsOC.keys = {
      LEFT: 'ArrowLeft', //left arrow
      UP: 'ArrowUp', // up arrow
      RIGHT: 'ArrowRight', // right arrow
      BOTTOM: 'ArrowDown' // down arrow
    }

    this.controlsOC.listenToKeyEvents(document.body); */

    // soft white light
    this.light = new THREE.AmbientLight(0x404040);
    this.scene.add(this.light);

    const dirLight = new THREE.DirectionalLight( 0xefefff, 1.5 );
    dirLight.position.set( 10, 10, 10 );
    this.scene.add( dirLight );
    /* const helper1 = new THREE.DirectionalLightHelper( dirLight, 5 );
    this.scene.add( helper1 );
 */
    const dirLight2 = new THREE.DirectionalLight( 0xefefff, 0.8 );
    dirLight2.position.set( -60, 10, -10 );
    this.scene.add( dirLight2 );
    /* const helper2 = new THREE.DirectionalLightHelper( dirLight2, 5 );
    this.scene.add( helper2 ); */


    const light33 = new THREE.PointLight( 0xff0000, 1, 100 );
    light33.position.set( 50, 50, 50 );
    this.scene.add( light33 );

  }

  public animate(): void {
    // We have to run this outside angular zones,
    // because it could trigger heavy changeDetection cycles.
    this.ngZone.runOutsideAngular(() => {
      if (document.readyState !== 'loading') {
        this.render();
      } else {
        window.addEventListener('DOMContentLoaded', () => {
          this.render();
        });
      }

      window.addEventListener('resize', () => {
        this.resize();
      });
    });
  }

  public render(): void {
    this.frameId = requestAnimationFrame(() => {
      this.render();
    });
    this.controlsOC.update();

    if(this.renderer != undefined && this.scene != undefined &&  this.camera!= undefined){

      this.renderer.render(this.scene, this.camera);
    }

  }

  public resize(): void {
    const canvas = document.getElementById('renderCanvas');
    if(canvas){
      const width = document.documentElement.clientWidth;
      const height = document.documentElement.clientHeight * 0.90;

      if(this.cube != undefined &&this.renderer != undefined && this.scene != undefined &&  this.camera!= undefined){

        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(width, height);

      }
    }

  }

  public cargarObjetoPath(path:any){
    const loader = new GLTFLoader();

    // Optional: Provide a DRACOLoader instance to decode compressed mesh data
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath( '/examples/js/libs/draco/' );
    loader.setDRACOLoader( dracoLoader );
    //console.log(path);
    const auxPath = '../../../assets/uploads/escena/' + path;
    //console.log(auxPath)
        loader.load(
      // resource URL
      auxPath ,
      // called when the resource is loaded
      ( gltf ) =>{
        this.cargado.emit('');
        if(!this.alphaChanger)
        this.scene?.add(gltf.scene);

        gltf.animations; // Array<THREE.AnimationClip>
        gltf.scene; // THREE.Group
        gltf.scenes; // Array<THREE.Group>
        gltf.cameras; // Array<THREE.Camera>
        gltf.asset; // Object
        if (this.scene && this.alphaChanger){
          for (let i = gltf.scene.children.length - 1; i >= 0; i--) {
            if(gltf.scene.children[i].type === "Group"){
              let groupObjs : any = gltf.scene.children[i].children;
              for(let j = groupObjs.length - 1; j >= 0; j--) {
                if(groupObjs[j].type === "Mesh"){
                  //console.log(groupObjs[j])
                  let wireframe = new THREE.WireframeGeometry( groupObjs[j].geometry );
                  const material = new THREE.LineBasicMaterial( {
                    color: 0o000000,
                    linewidth: 1,
                    linecap: 'round', //ignored by WebGLRenderer
                    linejoin:  'round' //ignored by WebGLRenderer
                  } );
                  let line = new THREE.LineSegments( wireframe,material );


                  this.scene.add( line );
                  //this.scene.remove( groupObjs[j]);
                }

                if(groupObjs[j].type === "Group"){
                  let groupsaux : any = groupObjs[j].children;
                  for(let j = groupsaux.length - 1; j >= 0; j--) {
                    if(groupsaux[j].type === "Mesh"){
                      //console.log(groupObjs[j])
                      let wireframe = new THREE.WireframeGeometry( groupsaux[j].geometry );
                      const material = new THREE.LineBasicMaterial( {
                        color: 0o00000,
                        linewidth: 1,
                        linecap: 'round', //ignored by WebGLRenderer
                        linejoin:  'round' //ignored by WebGLRenderer
                      } );
                      let line = new THREE.LineSegments( wireframe,material );


                      this.scene.add( line );
                      //this.scene.remove( groupObjs[j]);
                    }

                  }

                  //console.log(this.scene.children[i])
                }

              }

              //console.log(this.scene.children[i])
            }
            //this.scene.remove(this.scene.children[i]);
          }
        }

      },
      // called while loading is progressing
      function ( xhr ) {

        console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

      },
      // called when loading has errors
      function ( error ) {
        console.log( error)
        console.log( 'An error happened' );

      }
    );


  }



  public cargarobjeto(obejo: string){
    //Se borran todos los grupos de objetos3d que hay en la escena (generamente seran los objetos 3d que se hayan subido a la previsualización previamente)
    if (this.scene){
      for (let i = this.scene.children.length - 1; i >= 0; i--) {
        if(this.scene.children[i].type === "Group"){
          this.scene.remove(this.scene.children[i]);
        }
        //this.scene.remove(this.scene.children[i]);
      }
    }

        // Instantiate a loader
    const loader = new GLTFLoader();

    // Optional: Provide a DRACOLoader instance to decode compressed mesh data
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath( '/examples/js/libs/draco/' );
    loader.setDRACOLoader( dracoLoader );

    // Load a glTF resource
    try {
      loader.parse(
        // glTF asset to parse, as an ArrayBuffer, JSON string or object.
        obejo,
        //The base path from which to find subsequent glTF resources such as textures and .bin data files
        '',
        //  A function to be called when parse completes.
       (gltf) => {

        this.scene?.add( gltf.scene );

       },
        // (optional) A function to be called if an error occurs during parsing. The function receives error as an argument.
        function ( error ) {

          console.log( 'An error happened' );

        }
      );
    } catch (e){
      console.log('Error en el cargador de gltf');
    }


  }
}
