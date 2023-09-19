import { Textura } from './Textura';

export class Malla{

  name:string;

  private vertices : Float32Array;
  private normales : Float32Array;
  private coordTextures : Float32Array;

  private count : number;

  private indices: Float32Array;
  private texturas: Array<Textura>;

  public constructor(name:string){
    this.name = name;
  }

  dibujar(){

    // Uniforms
    //    Obtener las matrices model, view y projection del arbol de la escena
    //    Obtener la posición de las luces y otras variables
    //    Asociar cada matriz y variable a un uniform del shader
    // Attributes
    //    Localizar en los shaders los attributes de vertices, normales y coordenadas de texturas
    //    Crear handles para los 3 buffers de attributes
    //    Para cada buffer
    //        Asociar datos en memoria al buffer
    //        Enlazar el buffer con su attribute
    //        Indicar estructura del buffer
    //        Habilitar buffer
    // Dibujar la malla
  }

  setVertexCount(value:any){
    this.count = value;
  }

  getVertexCount(){
    return this.count;
  }

  setVertex(arr : Float32Array){
    this.vertices = arr;
  }

  setNormals(arr : Float32Array){
    this.normales = arr;
  }

  setCoordTextures(arr : Float32Array){
    this.coordTextures = arr;
  }

  setIndices(arr : Float32Array){
    this.indices = arr;
  }

  setTextures(arr : Array<Textura>){
    this.texturas = arr;
  }



  getVertex(){
    return this.vertices;
  }

  getNormals(){
    return this.normales;
  }

  getCoordTextures(){
    return this.coordTextures;
  }

  getIndices(){
    return this.indices;
  }

  getTextures(arr : Array<Textura>){
    this.texturas = arr;
  }


}
