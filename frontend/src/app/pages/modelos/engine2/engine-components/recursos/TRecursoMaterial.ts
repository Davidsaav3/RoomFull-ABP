import { TRecurso } from './TRecurso';


export class TRecursoMaterial extends TRecurso{

  //Coeficientes Luz
  //Recursos de textura

  materialJson : JSON;

  imagenMaterial;

  imageInfo : JSON;

  public constructor(name : string){
    super(name);
  }

  cargarFichero (nombre:string){
    //leer fichero de la malla con webgl
  }

  setMaterial(material:JSON){
    this.materialJson = material;
  }

  setImagenMaterial(data :any){
    this.imagenMaterial = data;
   }

   setImagenInfo(data :JSON){
    this.imageInfo = data;
  }

}
