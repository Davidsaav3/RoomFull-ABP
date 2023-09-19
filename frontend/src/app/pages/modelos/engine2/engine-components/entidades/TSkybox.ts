import * as glMatrix from "gl-matrix";
import { TEntidad } from "./TEntidad";

import { TGestorRecurso } from '../recursos/TGestorRecurso';
import { TRecurso } from '../recursos/TRecurso';
import { TRecursoMalla } from "../recursos/TRecursoMalla";
import { TRecursoMaterial } from '../recursos/TRecursoMaterial';

export class TSkybox extends TEntidad{

  private recursos: TRecurso[] = [];

  textura : WebGLTexture;

  faces = 0;

  public constructor(){
    super();
  }

  public cargarModelo(){

  }

  public draw(gl, buffers, programInfo, projectionMatrix, modelMatrix, normalMatrix): void {

    this.setPositionAttribute(gl, buffers, programInfo);


    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);

    //this.setColorAttribute(gl, buffers, programInfo);

    this.setTextureAttribute(gl, buffers, programInfo);

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

     // Tell WebGL we want to affect texture unit 0
    gl.activeTexture(gl.TEXTURE0);

    // Bind the texture to texture unit 0
    gl.bindTexture(gl.TEXTURE_2D, this.textura);

    // Tell the shader we bound the texture to texture unit 0
    gl.uniform1i(programInfo.uniformLocations.uSampler, 0);

    { const vertexCount = buffers.vertexCount; //num vertices /3
      const type = gl.UNSIGNED_SHORT;
      const offset = 0;
      gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);}



  }


  setTextureAttribute(gl, buffers, programInfo) {
    const num = 2; // every coordinate composed of 2 values
    const type = gl.FLOAT; // the data in the buffer is 32-bit float
    const normalize = false; // don't normalize
    const stride = 0; // how many bytes to get from one set to the next
    const offset = 0; // how many bytes inside the buffer to start from
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.textureCoord);
    gl.vertexAttribPointer(
      programInfo.attribLocations.textureCoord,
      num,
      type,
      normalize,
      stride,
      offset
    );
    gl.enableVertexAttribArray(programInfo.attribLocations.textureCoord);
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

    const textureCoordBuffer = this.initTextureBuffer(gl);

    let urlImage  = '';

    this.recursos.forEach((recurso:any)=>{
      if(recurso instanceof TRecursoMaterial  ){

        urlImage = URL.createObjectURL(recurso.imagenMaterial);

      }
    })

    this.loadTexture(gl,urlImage)

    //gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    const normalBuffer = this.initNormalBuffer(gl);

    return {
      position: positionBuffer,
      indices: indexBuffer,
      normal: normalBuffer,
      vertexCount:vertexCount,
      textureCoord: textureCoordBuffer
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

  initTextureBuffer(gl) {
    const textureCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);

    const textcoords =  this.getTextCoord();

    gl.bufferData(
      gl.ARRAY_BUFFER,
      textcoords,
      gl.STATIC_DRAW
    );

    return textureCoordBuffer;
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
      if(recurso instanceof TRecursoMalla  ){

        salida =  new Uint16Array( recurso.getIndices().buffer);


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
    const pixel = new Uint8Array([0, 0, 255, 255]); // opaque blue
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

    const image = new Image();
    image.onload = () => {
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(
        gl.TEXTURE_2D,
        level,
        internalFormat,
        srcFormat,
        srcType,
        image
      );

      // WebGL1 has different requirements for power of 2 images
      // vs. non power of 2 images so check if the image is a
      // power of 2 in both dimensions.
      if (this.isPowerOf2(image.width) && this.isPowerOf2(image.height)) {
        // Yes, it's a power of 2. Generate mips.
        gl.generateMipmap(gl.TEXTURE_2D);
      } else {
        // No, it's not a power of 2. Turn off mips and set
        // wrapping to clamp to edge
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      }
    };
    image.src = url;

    this.textura =  texture;

  }

  isPowerOf2(value) {
    return (value & (value - 1)) === 0;
  }



  nada(){
    /* var availableColors =  [[1.0, 0.0, 0.0, 1.0], // red
    [0.0, 1.0, 0.0, 1.0], //  green
    [0.0, 0.0, 1.0, 1.0], //  blue
    [1.0, 1.0, 0.0, 1.0], //  yellow
    [1.0, 0.0, 1.0, 1.0], //  purple
    [1.0, 0.0, 1.0, 1.0]] // pink

  var faceColors :[number[]] = [[]];
  console.log(this.faces)
  // colores
      for (var i = 0; i<this.faces;i++){
        faceColors.push(availableColors[Math.floor(Math.random() * 6)])
      }


  const faceColors = [
    [1.0, 0.0, 0.0, 1.0], // Back face: red
    [0.0, 1.0, 0.0, 1.0], // Top face: green
    [0.0, 0.0, 1.0, 1.0], // Bottom face: blue
    [1.0, 1.0, 0.0, 1.0], // Right face: yellow
    [1.0, 0.0, 1.0, 1.0], // Left face: purple
    [1.0, 0.0, 1.0, 1.0]

  ];

  // Convert the array of colors into a table for all the vertices.

  var colors : number[] =[];

  for (var j = 0; j < faceColors.length; ++j) {
    const c = faceColors[j];
    // Repeat each color four times for the four vertices of the face
    colors = colors.concat(c, c, c, c);
  }

  const colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW); */
  }



}
