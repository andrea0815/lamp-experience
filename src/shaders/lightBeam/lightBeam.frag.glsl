uniform vec3 uBeamColor;
uniform float uBeamOpacity;
uniform float uBeamFadeEnd;
uniform float uBeamFadePower;

varying vec2 vBeamUv;

void main() {
  float fadeProgress = clamp(vBeamUv.y / uBeamFadeEnd, 0.0, 1.0);
  float heightFade = pow(1.0 - fadeProgress, uBeamFadePower);
  float alpha = uBeamOpacity * heightFade;

  gl_FragColor = vec4(uBeamColor, alpha);
}
