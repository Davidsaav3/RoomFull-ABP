    attribute vec4 aVertexPosition;
    attribute vec3 aVertexNormal;
    attribute vec2 aTextureCoord;

    uniform mat4 uNormalMatrix;

    uniform mat4 uModelViewMatrix;

    uniform mat4 uProjectionMatrix;



    uniform vec3 ulightsPositions;
    uniform vec3 uCameraPosition;
    uniform vec3 lightColor;

    varying highp vec2 vTextureCoord;
    varying highp vec3 vLighting;

    void main(void) {

      gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;

      vTextureCoord = aTextureCoord;

      highp vec3 FragPos = vec3(uNormalMatrix * aVertexPosition);

      //highp vec3 lightColor = vec3(1, 0.8, 0.3);

      highp float ambientStrength = 0.5;

      highp vec3 ambient = ambientStrength * lightColor;

      // diffuse
      highp vec3 norm = normalize(aVertexNormal);

      highp vec3 lightDir = normalize(ulightsPositions - FragPos);

      highp float diff = max(dot(norm, lightDir), 0.0);

      highp vec3 diffuse = diff * lightColor;

      // specular
      highp float specularStrength = 0.5;

      highp vec3 viewDir = normalize(uCameraPosition - FragPos);
      highp vec3 reflectDir = reflect(-lightDir, norm);

      highp float spec = pow(max(dot(viewDir, reflectDir), 0.0), 32.0);

      highp vec3 specular = specularStrength * spec * lightColor;

    vLighting = (ambient + diffuse + specular);


    }





/*
      // ambient este es el que estoy cmbiando, hay que ver por donde meter los atributos de la luz entre otras cosas, https://learnopengl.com/Lighting/Basic-Lighting para luego ir a la avanzada

      // Apply lighting effect

      highp vec3 ambientLight = vec3(0.3, 0.3, 0.3);
      //highp vec3 ambientLight = ulightsPositions;

      highp vec3 directionalLightColor = vec3(1, 1, 1);
      highp vec3 directionalVector = normalize(vec3(0.85, 0.8, 0.75));

      highp vec4 transformedNormal = uNormalMatrix * vec4(aVertexNormal, 1.0);

      highp float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);

      vLighting = ambientLight + (directionalLightColor * directional);
 */

// ambient
     /*  float ambientStrength = 0.1;

      vec3 ambient = ambientStrength * lightColor;

      // diffuse
      vec3 norm = uNormalMatrix * vec4(aVertexNormal, 1.0);

      vec3 lightDir = normalize(lightPos - FragPos);

      float diff = max(dot(norm, lightDir), 0.0);

      vec3 diffuse = diff * lightColor;

      // specular
      float specularStrength = 0.5;

      vec3 viewDir = normalize(viewPos - FragPos);
      vec3 reflectDir = reflect(-lightDir, norm);

      float spec = pow(max(dot(viewDir, reflectDir), 0.0), 32);

      vec3 specular = specularStrength * spec * lightColor;

      vec3 vLighting = (ambient + diffuse + specular);
 */
