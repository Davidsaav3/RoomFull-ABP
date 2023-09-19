import * as glMatrix from "gl-matrix"
import { TEntidad } from "./entidades/TEntidad";
import { TModelo } from './entidades/TModelo';
import { TLuz } from "./entidades/TLuz";


export class TNodo {

  hijos: TNodo[];
  mTranformacion: glMatrix.mat4;
  vTraslacion : glMatrix.vec3;
  vRotacion : glMatrix.vec3;
  vEscalado: glMatrix.vec3;
  entidad: TEntidad;
  padre: TNodo | undefined;
  quatRotation : glMatrix.vec4;
  normalMatrix : glMatrix.mat4;
  luceshijas : TNodo[];

  private actualizarMatrix = false;

  public constructor(public nombre?:string) {
      this.mTranformacion = glMatrix.mat4.create();
      this.vTraslacion = glMatrix.vec3.create();
      this.vRotacion = glMatrix.vec3.create();
      this.quatRotation = glMatrix.vec4.create();
      this.vEscalado = glMatrix.vec3.create();
      this.vEscalado = glMatrix.vec3.fromValues(1,1,1);
      this.normalMatrix = glMatrix.mat4.create();
      this.entidad = new TEntidad();
      this.hijos = [];
      this.luceshijas = [];

  }

//get set con otras entidades

  public addHijo( hijon:TNodo ) {

    this.hijos.push(hijon);
    hijon.setPadre(this);
    if(hijon.entidad instanceof TLuz){
      this.luceshijas.push(hijon);
    }

  }


  public addHijos( hijos:TNodo[] ) {
    hijos.forEach((value : TNodo)=>{
      this.hijos.push(value);
      value.setPadre(this);
    })


  }

  public removeHijo(hijon:TNodo) {
      this.hijos.forEach( (elem, index) => {
          if (elem == hijon) {
              this.hijos.splice(index, 1);
              elem.removePadre();
          }
      })
  }

  public setEntidad(entidadn: TEntidad){
      return this.entidad=entidadn;
  }

  public getEntidad(){
      return this.entidad;
  }

  public setPadre(papa: TNodo){
      this.padre=papa;
  }

  public removePadre(){
    this.padre = undefined;
  }

  public getPadre(){
      return this.padre;
  }

// calcular tranformaciones y recorrer

calcularMatrixQuat(){
  return glMatrix.mat4.fromRotationTranslationScale(glMatrix.mat4.create(), this.quatRotation, this.vTraslacion, this.vEscalado) ;
}

/**
   * Aplica las transformaciones de escalado, rotación y traslación a su matriz de transformación.
   * @returns Matriz de transformación calculada.
   */
  private calcularMatriz(){
      var mAux1 = glMatrix.mat4.create();
     /*  var mAux2 = glMatrix.mat4.create();
      var mAux3 = glMatrix.mat4.create();
      var mAux4 = glMatrix.mat4.create(); */

      // operaciones en orden de premutiplicacion (tras * rot * esc )

      //1 - escalado
      mAux1 = glMatrix.mat4.scale(glMatrix.mat4.create(),mAux1,this.vEscalado);

      //2 - rotacion en tres ejes X Y Z

      mAux1 = glMatrix.mat4.rotateX(glMatrix.mat4.create(),mAux1,this.vRotacion[0]);

      mAux1 = glMatrix.mat4.rotateY(glMatrix.mat4.create(),mAux1,this.vRotacion[1]);

      mAux1 = glMatrix.mat4.rotateZ(glMatrix.mat4.create(),mAux1,this.vRotacion[2]);

      glMatrix.mat4.invert(this.normalMatrix, mAux1);
      glMatrix.mat4.transpose(this.normalMatrix, this.normalMatrix);

      //3 - traslacion

      mAux1 = glMatrix.mat4.translate(glMatrix.mat4.create(),mAux1,this.vTraslacion);

      //multiplicacion - ¿No hay que hacer la multiplicacion si aplico las transformaciones en orden? da igual

      /* mAux4 = glMatrix.mat4.multiply(glMatrix.mat4.create(),mAux3,mAux2);
      mAux4 = glMatrix.mat4.multiply(glMatrix.mat4.create(),mAux4,mAux1); */

      //console.log('calcular matriz',mAux1);

      return mAux1;
  }

   /**
   * Aplica las transformaciones a su matriz de transformación y las traspasa a sus hijos, si es un nodo hijo aplica las del padre.
   * @param mat - Matriz identidad o matriz del padre
   */
  public recorrer(mat : glMatrix.mat4 ){

    //¿Si el hijo no ha hecho ninguna operación (tras, esc, rot) deberían aplicarse las transformaciones que ha sufrido el padre?
    //propagar a los hijos
      if(this.actualizarMatrix==true){
        this.actualizarMatrix=false;

        this.mTranformacion = glMatrix.mat4.multiply(glMatrix.mat4.create() , mat , this.calcularMatriz() );

        console.log('recorrer',this.mTranformacion);

        this.entidad.dibujar(this.mTranformacion);

        this.hijos.forEach( (elem, index) => {
            elem.recorrer(this.mTranformacion);
        })
      }


  }

  public dibujarm(){
      const salida:any[] = []

      salida.push(this.mTranformacion);
      salida.push('|||');

      this.hijos.forEach( (elem, index) => {
          salida.push(elem.dibujarm());
      })

      return salida;

  }

  public draw(gl, buffers, programInfoObject, programInfoLight, programInfoShadow, projectionMatrix, posicionesLucesEscena, cameraPos, ambienteColor, fondo){
  try{

    if(buffers.position==undefined){
      console.log(this.nombre);
    }else{
      let program;
      if(this.entidad instanceof TModelo){
          program = programInfoObject;
          this.entidad.draw( gl, buffers, program , programInfoShadow, projectionMatrix, this.calcularMatrixQuat(), this.normalMatrix, this.nombre, posicionesLucesEscena, cameraPos, ambienteColor, fondo);
      }if(this.entidad instanceof TLuz){
          program = programInfoLight;
          this.entidad.draw( gl, buffers, program , programInfoShadow, projectionMatrix, this.calcularMatrixQuat(), this.normalMatrix, this.nombre);
      }

    }
  }
  catch(e){
   //console.log( this.nombre)
  }
  }

//get set de caracteristicas y operaciones

  public setTraslacion(vec: glMatrix.vec3){
      this.vTraslacion=vec;
      this.actualizarMatrix=true;
  }

  public setRotacion3(vec: glMatrix.vec3){
      this.vRotacion=vec;
      this.actualizarMatrix=true;
  }

  public setRotacion4(vec: any){
    this.quatRotation=vec;
    this.actualizarMatrix=true;
}

  public setEscalado(vec: glMatrix.vec3){
      this.vEscalado=vec;
      this.actualizarMatrix=true;
  }

  public trasladar(vec: glMatrix.vec3){
      this.vTraslacion = glMatrix.vec3.add(this.vTraslacion,this.vTraslacion,vec);
      this.actualizarMatrix=true;
  }

  public rotar(vec: glMatrix.vec3){
      this.vRotacion = glMatrix.vec3.add(this.vRotacion,this.vRotacion,vec);
      this.actualizarMatrix=true;
  }

  public escalar(vec: glMatrix.vec3){
      this.vEscalado = glMatrix.vec3.multiply(this.vEscalado,this.vEscalado,vec);
      this.actualizarMatrix=true;
  }

  public getTraslacion(){
      return this.vTraslacion;
  }

  public getRotacion3(){
      return this.vRotacion;
  }

  public getRotacion4(){
    return this.quatRotation;
}

  public getEscalado(){
      return this.vEscalado;
  }

  public setMatrizTrans (mat: glMatrix.mat4){
      this.mTranformacion = mat;
      this.actualizarMatrix=true;
  }

  public getMatrizTrans (){
      return this.mTranformacion;
  }

  public getPosicionesLucesHijas(){
   /*
    this.luceshijas.forEach((hijo:TNodo)=>{
      if(hijo.entidad instanceof TLuz){
        luces.push(hijo.vTraslacion)
      }
    }) */

    let luces : glMatrix.vec3[] = [this.luceshijas[0].vTraslacion];

    return luces;
  }

};
