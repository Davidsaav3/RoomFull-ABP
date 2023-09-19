import { TRecurso } from './TRecurso';
import { Malla } from './../clases/Malla';


export class TRecursoMalla extends TRecurso{

  private mallas : Malla[] = [];

  getbuffer : boolean = false;

  public constructor(name : string, getbufferbool ? : boolean){
    super(name);
    if(getbufferbool != undefined ){
      this.getbuffer = getbufferbool;
    }
  }

  cargarFichero (nombreFichero : string){
      // Leer recurso con la libreria (nombreFichero)
      // Para cada malla
      //      Crear malla nueva
      //      Guardar vertices, normales y texturas
      //      Guardar indices
      //      Guardar texturas y materiales
      //      Guardar malla en array
  }

  addMalla(malla : Malla){
    this.mallas.push(malla);
  }

  dibujar(){
    // Para cada malla
    //      malla.dibujar();
  }

  getIndices(){
    return this.mallas[0].getIndices();
  }

  getPosition(){
    return this.mallas[0].getVertex();
  }

  getVertexCount(){
    return this.mallas[0].getVertexCount();
  }

  getTextCoord(){
    return this.mallas[0].getCoordTextures();
  }

  getNormals(){
    return this.mallas[0].getNormals();
  }
}
