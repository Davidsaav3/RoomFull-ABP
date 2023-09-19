
import { environment } from '../../environments/environment';
import { Schema, model } from 'mongoose';

const base_url: string = environment.base_url;

export class Suscripcion {

    constructor( public fechaIni: string, 
                 public fechaFin: string, 
                 public idUsuario: Schema.Types.ObjectId, //Schema.Types.ObjectId,
                 public idTipoSus: Schema.Types.ObjectId,  //Schema.Types.ObjectId,
                 public metodoPago: Number, 
                 public renovacion: Boolean, 
                 ) {}
}
