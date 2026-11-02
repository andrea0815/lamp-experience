varying vec2 vBeamUv;

void main() {
  vBeamUv = uv;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
