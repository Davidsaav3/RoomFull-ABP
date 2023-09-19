
import { environment } from '../../environments/environment';
import { Schema, model } from 'mongoose';

const base_url: string = environment.base_url;

export class Chat {

    constructor( public idUsuarioEmi: Schema.Types.ObjectId, //Schema.Types.ObjectId,
                 public idUsuarioRec: Schema.Types.ObjectId, //Schema.Types.ObjectId,
                 public mensajes: Array<string>,
                 public asunto: Array<string>,
                 public fecha: Date
                 ,
                 ) {}
}
