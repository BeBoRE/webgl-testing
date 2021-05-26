(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[161],{4106:function(t,n,e){"use strict";e.r(n),e.d(n,{default:function(){return a}});var o=e(5893),r=e(9008),i=e(773),l=e(1075),a=function(){return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(r.default,{children:(0,o.jsx)("title",{children:"GLSL testing"})}),(0,o.jsx)(i.Z,{fragment:"#ifdef GL_ES\nprecision mediump float;\n#endif\n\nuniform vec2 u_resolution;\n\nvoid main(){\n    vec2 st = gl_FragCoord.xy/u_resolution.xy;\n    vec3 color = vec3(0.0);\n\n    // Each result will return 1.0 (white) or 0.0 (black).\n    float left = step(0.1,st.x);   // Similar to ( X greater than 0.1 )\n    float bottom = step(0.1,st.y); // Similar to ( Y greater than 0.1 )\n\n    float right = step(0.1, abs(st.x - 1.0));\n    float top = step(0.1, abs(st.y - 1.0));\n\n    // The multiplication of left*bottom will be similar to the logical AND.\n    color = vec3(left * bottom * right * top);\n\n    gl_FragColor = vec4(color,1.0);\n}\n",vertex:l.Z,className:"canvas"})]})}},9526:function(t,n,e){(window.__NEXT_P=window.__NEXT_P||[]).push(["/step7",function(){return e(4106)}])}},function(t){t.O(0,[304,774,888,179],(function(){return n=9526,t(t.s=n);var n}));var n=t.O();_N_E=n}]);