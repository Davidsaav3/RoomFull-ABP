
import { environment } from '../../environments/environment';
import { Schema, model } from 'mongoose';

const base_url: string = environment.base_url;

export class Mensaje {

    constructor( public id: Schema.Types.ObjectId, //Schema.Types.ObjectId,
                 public mensajes: string, 
                 public fecha: Date, 
                 public hora: String, 
                 ) {}
}
