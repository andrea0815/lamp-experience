float lampShadeFade = 1.0 - smoothstep(
  uLampShadeFadeStart,
  uLampShadeFadeEnd,
  vLampShadeHeight
);

diffuseColor.a *= lampShadeFade;
