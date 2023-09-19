import { TRecurso } from './TRecurso';
export class TRecursoTextura extends TRecurso{
  private id: Number
  private width: Number;
  private height: Number;
  public constructor(name: string){
    super(name);
  }

  cargarFichero(nombre:string){

  }

}
