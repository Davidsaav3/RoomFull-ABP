

export class TRecurso {

  private nombre : string = '';

  public constructor(nombre: string) {
    this.nombre = nombre;
  }

  public getNombre(){
    return this.nombre;
  }

  public setNombre(newName : string){
    this.nombre = newName;
  }

}
