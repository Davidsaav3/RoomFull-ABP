import { Malla } from '../clases/Malla';
import { TModelo } from '../entidades/TModelo';
import { TNodo } from '../TNodo';
import { TRecurso } from './TRecurso';
import { TRecursoMalla } from './TRecursoMalla';
import { TRecursoMaterial } from './TRecursoMaterial';
import { EscenaService } from '../../../../../services/escena.service';
import { Buffer } from 'buffer';
import { base64StringToBlob } from 'blob-util'
import * as glMatrix from 'gl-matrix';
import { TLuz } from '../entidades/TLuz';
import { TSkybox } from '../entidades/TSkybox';

export class TGestorRecurso{

  vRecursos : TRecurso[];
  imageSkybox : any;
  token: string;

  public constructor(private escenaService: EscenaService){
    this.vRecursos = [];
  }


  addRecuso(rec:TRecurso){
    this.vRecursos.push(rec);
  }

/**
 * Busca el recurso en el vector de recursos
 * @param recName - Nombre del recurso a buscar
 * @returns Devuelve el recurso si lo ha encontrado en el vector
 */

  public getRecurso(recName : string): TRecurso | undefined{
    var recSalida : undefined | TRecurso = undefined;
    for(var recurso of this.vRecursos){
      if(recurso.getNombre() === recName){
        recSalida = recurso;
      }
    }

    if(recSalida === undefined){
      try{
        recSalida = new TRecurso(recName);
        this.vRecursos.push(recSalida);
      }catch(error){
        console.log("Error al cargar el recurso " + error);
      }
    }
    return recSalida;
  }

loadCosasDeLaEscena() : Promise<TNodo[]>{


  return new Promise(resolve =>{

    this.escenaService.cargarSkybox().subscribe({
      next:((res : any)=>{
        let VNodos: TNodo[] = [];



        //res.images -> array

        // Create skybox
        VNodos.push(this.loadSkybox(res.images)); // res.images
        VNodos.push(this.loadFloor(res.images[2])); // res.images[0] para la primera imagen
        VNodos.push(this.loadLight());

        resolve(VNodos);

      })
    });
  })

}


 /**
 * Coge el contenido de un gltf y obtiene los nodos para añadirlos a la escena con sus atributos.
 * @param name - Nombre del gltf a buscar
 * @returns Devuelve el recurso si lo ha encontrado en el vector
 */

 loadGLTF(name : string): any{
  return new Promise(resolve =>{
    var VNodos: TNodo[] = [];
    //name = 'cajasimple.gltf';

    this.token = localStorage.getItem('token') || '';
    if (this.token){
      this.escenaService.cargarContenidoEscena(name).subscribe({
        next:((res : any)=>{
          console.log(res['content']);
         const gltfFile = JSON.parse(res['content'])

          console.log(gltfFile);

          //Partials

          const accessors = gltfFile['accessors'];
          const bufferviews = gltfFile['bufferViews'];
          const buffers = gltfFile['buffers'];
          const nodes = gltfFile['nodes'];//Crear los TNodos para asignar todos los datos
          const meshes = gltfFile['meshes'];
          const materials = gltfFile['materials'];
          const images = gltfFile['images'];
          const textures = gltfFile['textures']

          const arrayMaterials: Array<TRecursoMaterial> = [];

          if(materials){
            materials.forEach(element => {
              arrayMaterials.push(this.loadMaterials(element));
            });
          }

          var bufferBinary = Buffer.from(buffers[0]['uri'].split('base64,')[1],'base64').toString('binary');
          const arrayBuffers: Array<any> = [];

          bufferviews.forEach(element => {
            arrayBuffers.push(this.loadBuffers(element, bufferBinary));
          });

          //Crear nodos
          nodes.forEach(element => {

            //.mesh!=undefined
            if(element.mesh!=undefined){

              // pillar traslacion rotaciopn scalado si la hay
              //entra aqui si el elemento tiene un mesh
              var newNodo = new TNodo(element.name);
              var newTModelo = new TModelo();

              var newTRecursoMalla = new TRecursoMalla('MallaContainer');

              var newMalla = new Malla(meshes[element.mesh].name);

              if(element.translation != undefined){
                newNodo.setTraslacion(element.translation);
              }

              if(element.rotation != undefined){
                newNodo.setRotacion4(element.rotation);
              }

              if(element.scale != undefined){

                newNodo.setEscalado(element.scale);
              }



              newMalla.setVertex(arrayBuffers[accessors[meshes[element.mesh].primitives[0].attributes.POSITION].bufferView]);

              newMalla.setVertexCount(accessors[meshes[element.mesh].primitives[0].indices].count)

              newMalla.setNormals(arrayBuffers[accessors[meshes[element.mesh].primitives[0].attributes.NORMAL].bufferView]);

              newMalla.setCoordTextures(arrayBuffers[accessors[meshes[element.mesh].primitives[0].attributes.TEXCOORD_0].bufferView]);

              newMalla.setIndices(arrayBuffers[accessors[meshes[element.mesh].primitives[0].indices].bufferView]);

              if(meshes[element.mesh].primitives[0].material!=undefined){

                var newTRecursoMaterial = new TRecursoMaterial('MaterialContainer');
                newTRecursoMaterial.setMaterial(materials[meshes[element.mesh].primitives[0].material]);

                if(materials[meshes[element.mesh].primitives[0].material].pbrMetallicRoughness.baseColorTexture != undefined){

                  var auximag  = textures[materials[meshes[element.mesh].primitives[0].material].pbrMetallicRoughness.baseColorTexture.index].source;

                  let blob = new Blob( [ arrayBuffers[images[auximag].bufferView] ], { type: "image/png" } );

                  newTRecursoMaterial.setImagenMaterial(blob);
                }else{
                  newTRecursoMaterial.setImagenMaterial("none");
                }

                newTModelo.addRecurso(newTRecursoMaterial);

              }


              newTRecursoMalla.addMalla(newMalla);



              newTModelo.addRecurso(newTRecursoMalla);

              //newTModelo.setRecursos(newGestorRec); gestorglobal del servicio

              newNodo.setEntidad(newTModelo);

              VNodos.push(newNodo);
              //console.log(newNodo)
            }
          });


          resolve(VNodos);
        })});
    }
    else {
      this.escenaService.cargarContenidoEscenaNoToken(name).subscribe({
        next:((res : any)=>{
          console.log(res['content']);
         const gltfFile = JSON.parse(res['content'])

          console.log(gltfFile);

          //Partials

          const accessors = gltfFile['accessors'];
          const bufferviews = gltfFile['bufferViews'];
          const buffers = gltfFile['buffers'];
          const nodes = gltfFile['nodes'];//Crear los TNodos para asignar todos los datos
          const meshes = gltfFile['meshes'];
          const materials = gltfFile['materials'];
          const images = gltfFile['images'];
          const textures = gltfFile['textures']

          const arrayMaterials: Array<TRecursoMaterial> = [];

          if(materials){
            materials.forEach(element => {
              arrayMaterials.push(this.loadMaterials(element));
            });
          }

          var bufferBinary = Buffer.from(buffers[0]['uri'].split('base64,')[1],'base64').toString('binary');
          const arrayBuffers: Array<any> = [];

          bufferviews.forEach(element => {
            arrayBuffers.push(this.loadBuffers(element, bufferBinary));
          });

          //Crear nodos
          nodes.forEach(element => {

            //.mesh!=undefined
            if(element.mesh!=undefined){

              // pillar traslacion rotaciopn scalado si la hay
              //entra aqui si el elemento tiene un mesh
              var newNodo = new TNodo(element.name);
              var newTModelo = new TModelo();

              var newTRecursoMalla = new TRecursoMalla('MallaContainer');

              var newMalla = new Malla(meshes[element.mesh].name);

              if(element.translation != undefined){
                newNodo.setTraslacion(element.translation);
              }

              if(element.rotation != undefined){
                newNodo.setRotacion4(element.rotation);
              }

              if(element.scale != undefined){

                newNodo.setEscalado(element.scale);
              }



              newMalla.setVertex(arrayBuffers[accessors[meshes[element.mesh].primitives[0].attributes.POSITION].bufferView]);

              newMalla.setVertexCount(accessors[meshes[element.mesh].primitives[0].indices].count)

              newMalla.setNormals(arrayBuffers[accessors[meshes[element.mesh].primitives[0].attributes.NORMAL].bufferView]);

              newMalla.setCoordTextures(arrayBuffers[accessors[meshes[element.mesh].primitives[0].attributes.TEXCOORD_0].bufferView]);

              newMalla.setIndices(arrayBuffers[accessors[meshes[element.mesh].primitives[0].indices].bufferView]);

              if(meshes[element.mesh].primitives[0].material!=undefined){

                var newTRecursoMaterial = new TRecursoMaterial('MaterialContainer');
                newTRecursoMaterial.setMaterial(materials[meshes[element.mesh].primitives[0].material]);

                if(materials[meshes[element.mesh].primitives[0].material].pbrMetallicRoughness.baseColorTexture != undefined){

                  var auximag  = textures[materials[meshes[element.mesh].primitives[0].material].pbrMetallicRoughness.baseColorTexture.index].source;

                  let blob = new Blob( [ arrayBuffers[images[auximag].bufferView] ], { type: "image/png" } );

                  newTRecursoMaterial.setImagenMaterial(blob);
                }else{
                  newTRecursoMaterial.setImagenMaterial("none");
                }

                newTModelo.addRecurso(newTRecursoMaterial);

              }


              newTRecursoMalla.addMalla(newMalla);



              newTModelo.addRecurso(newTRecursoMalla);

              //newTModelo.setRecursos(newGestorRec); gestorglobal del servicio

              newNodo.setEntidad(newTModelo);

              VNodos.push(newNodo);
              //console.log(newNodo)
            }
          });


          resolve(VNodos);
        })});
    }





  })
}

loadMaterials(material: any) {
  var materials: TRecursoMaterial = new TRecursoMaterial(material.name);
  materials = material;
  return materials;
}

loadBuffers(bufferviews: any, bufferBinary: any) {
  while(bufferviews.byteLength%4 != 0){
    bufferviews.byteLength += 1;
  }
  var data = Buffer.from(bufferBinary.slice(bufferviews.byteOffset,bufferviews.byteOffset + bufferviews.byteLength), 'binary');

  var buffer = new ArrayBuffer(data.byteLength);
  var floatView = new Uint8Array(buffer).set(data);
  var byteView = new Float32Array(buffer);


  return byteView;
}

loadSkybox(imagen: any){
  const vertices = [
    // Cara delantera
    -1.0, -1.0,  1.0,
    1.0, -1.0,  1.0,
    1.0,  1.0,  1.0,
    -1.0,  1.0,  1.0,

    // Cara trasera
    -1.0, -1.0, -1.0,
    -1.0,  1.0, -1.0,
    1.0,  1.0, -1.0,
    1.0, -1.0, -1.0,

    // Bottom face

    1.0,  1.0, -1.0,
    1.0,  1.0,  1.0,
    -1.0,  1.0,  1.0,
    -1.0,  1.0, -1.0,

    // Top face
    -1.0, -1.0, -1.0,
    1.0, -1.0, -1.0,
    1.0, -1.0,  1.0,
    -1.0, -1.0,  1.0,

    // Right face
    1.0, -1.0, -1.0,
    1.0,  1.0, -1.0,
    1.0,  1.0,  1.0,
    1.0, -1.0,  1.0,

    // Left face
    -1.0, -1.0, -1.0,
    -1.0, -1.0,  1.0,
    -1.0,  1.0,  1.0,
    -1.0,  1.0, -1.0
  ];

  const vertexNormals = [
    // Front
    0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0,
     // Front
     0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0,
      // Front
    0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0,
     // Front
     0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0,
      // Front
    0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0,
     // Front
     0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0,
  ];

  const textureCoordinates = [
    // Left
    1/4, 1/3,
    0/4, 1/3,
    0/4, 2/3,
    1/4, 2/3,

    // Right
    2/4, 1/3,
    2/4, 2/3,
    3/4, 2/3,
    3/4, 1/3,

    // Bottom
    2/4, 3/3,
    1/4, 3/3,
    1/4, 2/3,
    2/4, 2/3,

    // Top
    2/4, 1/3,
    2/4, 0/3,
    1/4, 0/3,
    1/4, 1/3,

    // Back
    3/4, 1/3,
    3/4, 2/3,
    4/4, 2/3,
    4/4, 1/3,

    // Front
    2/4, 1/3,
    1/4, 1/3,
    1/4, 2/3,
    2/4, 2/3,
  ];

  const cubeVertexIndices = [
    0,  1,  2,      0,  2,  3,    // enfrente
    4,  5,  6,      4,  6,  7,    // atrás
    8,  9,  10,     8,  10, 11,   // arriba
    12, 13, 14,     12, 14, 15,   // fondo
    16, 17, 18,     16, 18, 19,   // derecha
    20, 21, 22,     20, 22, 23    // izquierda
  ];

  const translation = glMatrix.vec3.fromValues(0, 0, 0);

  const rotation = glMatrix.quat.fromValues(1, 0 ,0, 0);

  const scale = glMatrix.vec3.fromValues(200, 200, 200);

  let newNodo = new TNodo("Skybox");
  let newTModelo = new TModelo();

  let newTRecursoMalla = new TRecursoMalla('skybox',true);

  let newMalla = new Malla("Skybox");

  newMalla.setVertex(new Float32Array(vertices));

  newMalla.setVertexCount(36);

  newMalla.setNormals(new Float32Array(vertexNormals));

  newMalla.setCoordTextures(new Float32Array(textureCoordinates));

  newMalla.setIndices(new Float32Array(cubeVertexIndices));

  newNodo.setTraslacion(translation);

  newNodo.setRotacion4(rotation);

  newNodo.setEscalado(scale);

/*   let newTRecursoMaterial = new TRecursoMaterial('MaterialContainer');
  let blob = base64StringToBlob(imagen, "image/jpeg");



  newTRecursoMaterial.setImagenMaterial(blob);

  newTModelo.addRecurso(newTRecursoMaterial); */

  newTModelo.fondos = imagen;

  newTModelo.skybox = true;

  newTRecursoMalla.addMalla(newMalla);

  newTModelo.addRecurso(newTRecursoMalla);

  newNodo.setEntidad(newTModelo);

  return newNodo;
}

loadFloor(imagen: any) {
  const vertices = [
    // Cara delantera
    -1.0, -1.0,  1.0,
    1.0, -1.0,  1.0,
    1.0,  1.0,  1.0,
    -1.0,  1.0,  1.0,

    // Cara trasera
    -1.0, -1.0, -1.0,
    -1.0,  1.0, -1.0,
    1.0,  1.0, -1.0,
    1.0, -1.0, -1.0,

    // Bottom face

    1.0,  1.0, -1.0,
    1.0,  1.0,  1.0,
    -1.0,  1.0,  1.0,
    -1.0,  1.0, -1.0,

    // Top face
    -1.0, -1.0, -1.0,
    1.0, -1.0, -1.0,
    1.0, -1.0,  1.0,
    -1.0, -1.0,  1.0,

    // Right face
    1.0, -1.0, -1.0,
    1.0,  1.0, -1.0,
    1.0,  1.0,  1.0,
    1.0, -1.0,  1.0,

    // Left face
    -1.0, -1.0, -1.0,
    -1.0, -1.0,  1.0,
    -1.0,  1.0,  1.0,
    -1.0,  1.0, -1.0
  ];

  const vertexNormals = [
    // Front
    0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0,
     // Front
     0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0,
      // Front
    0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0,
     // Front
     0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0,
      // Front
    0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0,
     // Front
     0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0,
  ];

  const textureCoordinates = [
    // Left
    1/4, 1/3,
    0/4, 1/3,
    0/4, 2/3,
    1/4, 2/3,

    // Right
    2/4, 1/3,
    2/4, 2/3,
    3/4, 2/3,
    3/4, 1/3,

    // Bottom
    2/4, 3/3,
    1/4, 3/3,
    1/4, 2/3,
    2/4, 2/3,

    // Top
    2/4, 1/3,
    2/4, 0/3,
    1/4, 0/3,
    1/4, 1/3,

    // Back
    3/4, 1/3,
    3/4, 2/3,
    4/4, 2/3,
    4/4, 1/3,

    // Front
    2/4, 1/3,
    1/4, 1/3,
    1/4, 2/3,
    2/4, 2/3,
  ];

  const cubeVertexIndices = [
    0,  1,  2,      0,  2,  3,    // enfrente
    4,  5,  6,      4,  6,  7,    // atrás
    8,  9,  10,     8,  10, 11,   // arriba
    12, 13, 14,     12, 14, 15,   // fondo
    16, 17, 18,     16, 18, 19,   // derecha
    20, 21, 22,     20, 22, 23    // izquierda
  ];

  const translation = glMatrix.vec3.fromValues(0, -3, 0);

  const rotation = glMatrix.quat.fromValues(1, 0 ,0, 0);

  const scale = glMatrix.vec3.fromValues(100, 0.1, 100);

  let newNodo = new TNodo("Suelo");
  let newTModelo = new TModelo();

  let newTRecursoMalla = new TRecursoMalla('suelo',true);

  let newMalla = new Malla("Suelo");

  newMalla.setVertex(new Float32Array(vertices));

  newMalla.setVertexCount(36);

  newMalla.setNormals(new Float32Array(vertexNormals));

  newMalla.setCoordTextures(new Float32Array(textureCoordinates));

  newMalla.setIndices(new Float32Array(cubeVertexIndices));

  newNodo.setTraslacion(translation);

  newNodo.setRotacion4(rotation);

  newNodo.setEscalado(scale);

  let newTRecursoMaterial = new TRecursoMaterial('MaterialContainer');
  let blob = base64StringToBlob(imagen, "image/jpeg");

  newTRecursoMaterial.setImagenMaterial(blob);

  newTModelo.addRecurso(newTRecursoMaterial);

  newTRecursoMalla.addMalla(newMalla);

  newTModelo.addRecurso(newTRecursoMalla);

  newNodo.setEntidad(newTModelo);

  return newNodo;
}

loadLight() {
  const vertices = [
    // Cara delantera
    -1.0, -1.0,  1.0,
    1.0, -1.0,  1.0,
    1.0,  1.0,  1.0,
    -1.0,  1.0,  1.0,

    // Cara trasera
    -1.0, -1.0, -1.0,
    -1.0,  1.0, -1.0,
    1.0,  1.0, -1.0,
    1.0, -1.0, -1.0,

    // Bottom face

    1.0,  1.0, -1.0,
    1.0,  1.0,  1.0,
    -1.0,  1.0,  1.0,
    -1.0,  1.0, -1.0,

    // Top face
    -1.0, -1.0, -1.0,
    1.0, -1.0, -1.0,
    1.0, -1.0,  1.0,
    -1.0, -1.0,  1.0,

    // Right face
    1.0, -1.0, -1.0,
    1.0,  1.0, -1.0,
    1.0,  1.0,  1.0,
    1.0, -1.0,  1.0,

    // Left face
    -1.0, -1.0, -1.0,
    -1.0, -1.0,  1.0,
    -1.0,  1.0,  1.0,
    -1.0,  1.0, -1.0
  ];

  const vertexNormals = [
    // Front
   0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0,

   // Back
   0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0,

   // Top
   0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0,

   // Bottom
   0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0,

   // Right
   1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0,

   // Left
   -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0,
  ];

  const textureCoordinates = [
    // Left
    1/4, 1/3,
    0/4, 1/3,
    0/4, 2/3,
    1/4, 2/3,

    // Right
    2/4, 1/3,
    2/4, 2/3,
    3/4, 2/3,
    3/4, 1/3,

    // Bottom
    2/4, 3/3,
    1/4, 3/3,
    1/4, 2/3,
    2/4, 2/3,

    // Top
    2/4, 1/3,
    2/4, 0/3,
    1/4, 0/3,
    1/4, 1/3,

    // Back
    3/4, 1/3,
    3/4, 2/3,
    4/4, 2/3,
    4/4, 1/3,

    // Front
    2/4, 1/3,
    1/4, 1/3,
    1/4, 2/3,
    2/4, 2/3,
  ];

  const cubeVertexIndices = [
    0,  1,  2,      0,  2,  3,    // enfrente
    4,  5,  6,      4,  6,  7,    // atrás
    8,  9,  10,     8,  10, 11,   // arriba
    12, 13, 14,     12, 14, 15,   // fondo
    16, 17, 18,     16, 18, 19,   // derecha
    20, 21, 22,     20, 22, 23    // izquierda
  ];

  const translation = glMatrix.vec3.fromValues(10, 5, 0);

  const rotation = glMatrix.quat.fromValues(1, 0 ,0, 0);

  const scale = glMatrix.vec3.fromValues(1, 1, 1);

  let newNodo = new TNodo("luz");
  let newTLuz = new TLuz();

  let newTRecursoMalla = new TRecursoMalla('luz',true);

  let newMalla = new Malla("luz");

  newMalla.setVertex(new Float32Array(vertices));

  newMalla.setVertexCount(36);

  newMalla.setNormals(new Float32Array(vertexNormals));

  newMalla.setCoordTextures(new Float32Array(textureCoordinates));

  newMalla.setIndices(new Float32Array(cubeVertexIndices));

  newNodo.setTraslacion(translation);

  newNodo.setRotacion4(rotation);

  newNodo.setEscalado(scale);

  let newTRecursoMaterial = new TRecursoMaterial('MaterialContainer');


  newTRecursoMaterial.setImagenMaterial('white');

  newTLuz.addRecurso(newTRecursoMaterial);

  newTRecursoMalla.addMalla(newMalla);

  newTLuz.addRecurso(newTRecursoMalla);

  newNodo.setEntidad(newTLuz);

  return newNodo;
}

}
