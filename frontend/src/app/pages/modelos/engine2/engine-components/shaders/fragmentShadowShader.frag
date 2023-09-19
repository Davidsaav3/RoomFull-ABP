
precision mediump int;
precision highp float;

void main() {
  float z = gl_FragCoord.z;
  gl_FragColor = vec4(z, 0.0, 0.0, 1.0);
}
