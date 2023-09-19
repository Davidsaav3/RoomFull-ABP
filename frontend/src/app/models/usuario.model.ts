
import { environment } from '../../environments/environment';

const base_url: string = environment.base_url;

export class Usuario {

    constructor( public uid: string,
                 public rol: string,
                 public email: string,
                 public nombre: string,
                 public apellidos: string,
                 public nombreUsuario: string,
                 public password: string,
                 public empresa: string,
                 public telefono: Number,
                 public imagen: string,
                 public descripcion?: string,
                 public EscenasLikes?:  Array<string>,
                 public EscenasGuardadas?: Array<string>,
                 public subscription?: string,
                 public opciones?: Array<Boolean>,
                 public metodo?:  String,
                 public codigo?: Number,
                 public fechaExpirado?: string,
                 ) {}

    get imagenUrl(): string {
        // Devolvemos la imagen en forma de peticilon a la API
        const token = localStorage.getItem('token') || '';
        if (!this.imagen) {
            return `${base_url}/upload/fotoperfil/no-imagen?token=${token}`;
        }
        return `${base_url}/upload/fotoperfil/${this.imagen}?token=${token}`;
    }
}
