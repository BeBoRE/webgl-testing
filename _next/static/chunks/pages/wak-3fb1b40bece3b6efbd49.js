(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[341],{716:function(n,o,e){"use strict";e.r(o),e.d(o,{default:function(){return s}});var i=e(5893),u=e(9008),t=e(773),r=e(1075),s=function(){return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)(u.default,{children:(0,i.jsx)("title",{children:"GLSL testing"})}),(0,i.jsx)(t.Z,{fragment:"varying lowp vec4 vColor;\nuniform lowp float u_time;\nuniform lowp vec2 u_mouse;\nuniform lowp vec2 u_resolution;\n\nvoid main(void) {\n  lowp vec2 mouseLocation = u_mouse / u_resolution;\n  lowp vec2 uv = gl_FragCoord.xy / u_resolution;\n  lowp float distanceToPixel = distance(u_mouse.xy, gl_FragCoord.xy) * (1.0 - (sin(u_time) + 1.0) / 5.0);\n\n  gl_FragColor = vec4(cos(distanceToPixel) * 0.6, sin(distanceToPixel) * 1.0, 0, 1.0);\n}\n",vertex:r.Z,className:"canvas"})]})}},7883:function(n,o,e){(window.__NEXT_P=window.__NEXT_P||[]).push(["/wak",function(){return e(716)}])}},function(n){n.O(0,[304,774,888,179],(function(){return o=7883,n(n.s=o);var o}));var o=n.O();_N_E=o}]);