varying lowp vec4 vColor;
uniform lowp float u_time;
uniform lowp vec2 u_mouse;
uniform lowp vec2 u_resolution;

void main(void) {
  lowp vec2 mouseLocation = u_mouse / u_resolution;
  lowp vec2 uv = gl_FragCoord.xy / u_resolution;
  lowp float distanceToPixel = distance(u_mouse.xy, gl_FragCoord.xy) * (1.0 - (sin(u_time) + 1.0) / 5.0);

  gl_FragColor = vec4(cos(distanceToPixel) * 0.6, sin(distanceToPixel) * 1.0, 0, 1.0);
}
