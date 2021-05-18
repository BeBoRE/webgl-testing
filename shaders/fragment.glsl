#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float easeOutBounce(float x) {
  float n1 = 7.5625;
  float d1 = 2.75;

  if (x < 1.0 / d1) {
      return n1 * x * x;
  } else if (x < 2.0 / d1) {
      return n1 * (x -= 1.5 / d1) * x + 0.75;
  } else if (x < 2.5 / d1) {
      return n1 * (x -= 2.25 / d1) * x + 0.9375;
  } else {
      return n1 * (x -= 2.625 / d1) * x + 0.984375;
  }
}

void main() {
  float distanceToMouse = distance(u_mouse.xy, gl_FragCoord.xy);

  float r = mod(distanceToMouse, 100.0 * ((sin(u_time) + 1.0) / 2.0)) / 100.0;

  gl_FragColor = vec4(r, r, r, 1.0);
}
