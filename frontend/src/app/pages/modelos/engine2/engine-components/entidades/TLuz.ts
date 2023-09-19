import * as glMatrix from "gl-matrix";
import { TEntidad } from "./TEntidad";
import { TRecursoMalla } from "../recursos/TRecursoMalla";
import { TRecurso } from "../recursos/TRecurso";
import { TRecursoMaterial } from "../recursos/TRecursoMaterial";

export class TLuz extends TEntidad{
  private intensidad: glMatrix.vec3;

  textura
/*
  public constructor(){
    super();
    this.intensidad = glMatrix.vec3.create();
  } */

  public setIntensidad(vec : glMatrix.vec3): void{
    this.intensidad = vec;
  }

  public getIntensidad(): glMatrix.vec3{
    return this.intensidad;
  }

  public override dibujar(mat4: glMatrix.mat4): void {
  }

  private recursos: TRecurso[] = [];

  public constructor(){
    super();
  }

  public cargarModelo(){

  }

  public draw(gl, buffers, programInfo, programShadow, projectionMatrix, modelMatrix, normalMatrix, nombre): void {

    this.setPositionAttribute(gl, buffers, programInfo);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);

    //this.setColorAttribute(gl, buffers, programInfo);

    this.setNormalAttribute(gl, buffers, programInfo);

    // Tell WebGL to use our program when drawing
    gl.useProgram(programInfo.program);

    // Set the shader uniforms
    gl.uniformMatrix4fv(
      programInfo.uniformLocations.projectionMatrix,
      false,
      projectionMatrix
    );

    gl.uniformMatrix4fv(
      programInfo.uniformLocations.modelViewMatrix,
      false,
      modelMatrix
    );

    gl.uniformMatrix4fv(
      programInfo.uniformLocations.normalMatrix,
      false,
      normalMatrix
    );



    // Tell the shader we bound the texture to texture unit 0
    gl.uniform1i(programInfo.uniformLocations.uSampler, 0);

    { const vertexCount = buffers.vertexCount; //num vertices /3
      const type = gl.UNSIGNED_SHORT;
      const offset = 0;

      gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);}
  }



   // Tell WebGL how to pull out the positions from the position
// buffer into the vertexPosition attribute.
setPositionAttribute(gl, buffers, programInfo) {
  const numComponents = 3; // pull out 2 values per iteration
  const type = gl.FLOAT; // the data in the buffer is 32bit floats
  const normalize = false; // don't normalize
  const stride = 0; // how many bytes to get from one set of values to the next
  // 0 = use type and numComponents above
  const offset = 0; // how many bytes inside the buffer to start from
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
  gl.vertexAttribPointer(
    programInfo.attribLocations.vertexPosition,
    numComponents,
    type,
    normalize,
    stride,
    offset
  );
  gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
}

setNormalAttribute(gl, buffers, programInfo) {
  const numComponents = 3;
  const type = gl.FLOAT;
  const normalize = false;
  const stride = 0;
  const offset = 0;
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.normal);
  gl.vertexAttribPointer(
    programInfo.attribLocations.vertexNormal,
    numComponents,
    type,
    normalize,
    stride,
    offset
  );
  gl.enableVertexAttribArray(programInfo.attribLocations.vertexNormal);
}


setColorAttribute(gl, buffers, programInfo) {
  const numComponents = 4;
  const type = gl.FLOAT;
  const normalize = false;
  const stride = 0;
  const offset = 0;

  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color);
  gl.vertexAttribPointer(
    programInfo.attribLocations.vertexColor,
    numComponents,
    type,
    normalize,
    stride,
    offset
  );
  gl.enableVertexAttribArray(programInfo.attribLocations.vertexColor);
}

  getBuffers(gl) {
    var a = this;

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const positions = a.getVertex();

    const vertexCount = a.getVertexCount();
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(
      gl.ELEMENT_ARRAY_BUFFER,
      a.getIndices(),
      gl.STATIC_DRAW
    );

    let urlImage  = '';

    this.recursos.forEach((recurso:any)=>{
      if(recurso instanceof TRecursoMaterial){
        if(recurso.imagenMaterial != "none" && recurso.imagenMaterial != "white"){
          urlImage = URL.createObjectURL(recurso.imagenMaterial);
        }else {
          urlImage = recurso.imagenMaterial;
        }
      }
    })

    this.loadTexture(gl,urlImage);

    //gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    const normalBuffer = this.initNormalBuffer(gl);

    return {
      position: positionBuffer,
      indices: indexBuffer,
      normal: normalBuffer,
      vertexCount:vertexCount
    };
  }


  addRecurso(recurso : TRecurso){
    this.recursos.push(recurso);
  }

  removeRecurso(recursoName : string) : boolean{
    var salida = false;

    this.recursos.forEach((value:TRecurso)=>{
      if(value.getNombre()===recursoName){
        salida=true;
        this.recursos = this.recursos.filter((elem:TRecurso)=>(elem.getNombre()!=recursoName));
      } else{
        salida=false;
      }
    })

    return salida;
  }



  initNormalBuffer(gl) {
    const normalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);

    const vertexNormals =  this.getNormals();
    gl.bufferData(
      gl.ARRAY_BUFFER,
      vertexNormals,
      gl.STATIC_DRAW
    );

    return normalBuffer;
  }

  getIndices(){
    var salida: Uint16Array | undefined = undefined;
    this.recursos.forEach((recurso:any)=>{
      if(recurso instanceof TRecursoMalla ){
        if(recurso.getbuffer){
          salida =  new Uint16Array( recurso.getIndices());
        }else{
          salida =  new Uint16Array( recurso.getIndices().buffer);
        }
      }
    })

    return salida ;
  }


  getTextCoord(){
    var salida: Float32Array | undefined = undefined;
    this.recursos.forEach((recurso:any)=>{
      if(recurso instanceof TRecursoMalla  ){

        salida =  new Float32Array( recurso.getTextCoord().buffer);


      }
    })

    return salida ;
  }

  getNormals(){
    var salida: Float32Array | undefined = undefined;
    this.recursos.forEach((recurso:any)=>{
      //&& recurso.getNombre() != "skybox"
      if(recurso instanceof TRecursoMalla  ){

        salida =  new Float32Array( recurso.getNormals().buffer);


      }
    })

    return salida ;
  }

  getVertex(){
    var salida: Float32Array = new Float32Array;
    this.recursos.forEach((recurso:any)=>{
      if(recurso instanceof TRecursoMalla  ){

        salida = recurso.getPosition();

      }
    })

    return salida ;

  }

  getVertexCount(){
    var salida: number | undefined = undefined;
    this.recursos.forEach((recurso:any)=>{
      if(recurso instanceof TRecursoMalla  ){

        salida = recurso.getVertexCount();

      }
    })

    return salida ;

  }


  loadTexture(gl, url) {
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // Because images have to be downloaded over the internet
    // they might take a moment until they are ready.
    // Until then put a single pixel in the texture so we can
    // use it immediately. When the image has finished downloading
    // we'll update the texture with the contents of the image.
    const level = 0;
    const internalFormat = gl.RGBA;
    const width = 1;
    const height = 1;
    const border = 0;
    const srcFormat = gl.RGBA;
    const srcType = gl.UNSIGNED_BYTE;
    let pixel = new Uint8Array([255, 255, 255, 255]);


    gl.texImage2D(
      gl.TEXTURE_2D,
      level,
      internalFormat,
      width,
      height,
      border,
      srcFormat,
      srcType,
      pixel
    );



    this.textura =  texture;

  }

  isPowerOf2(value) {
    return (value & (value - 1)) === 0;
  }




}
