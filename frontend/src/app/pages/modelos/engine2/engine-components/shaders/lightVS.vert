attribute vec4 aVertexPosition;
    attribute vec3 aVertexNormal;

    uniform mat4 uNormalMatrix;
    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;

    varying highp vec3 vLighting;

    void main(void) {

      gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;

    }
