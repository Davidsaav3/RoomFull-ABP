
import { environment } from '../../environments/environment';
import { Schema, model } from 'mongoose';

const base_url: string = environment.base_url;

export class TipoSuscripcion {

    constructor( public nombre: string,
                 public descripcion: string,
                 public precio: Number,
                 public modelos: Number,
                 public caract: string
                 ) {}
}
