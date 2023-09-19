
import { environment } from '../../environments/environment';

const base_url: string = environment.base_url;

export class Escena {

    constructor( public uid: string,
                 public fecha: Date,
                 public nombre: String,
                 public descripcion: string,
                 public creadorID: string,
                 public modelo: string,
                 public imagen: string,
                 public url: string,
                 public privado: Boolean,
                 public NVisitas: Number,
                 public NValoraciones: Number,
                 public NGuardados: Number) {}
}
