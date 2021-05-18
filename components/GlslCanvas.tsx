import React, { useEffect, useRef } from 'react';

interface ProgramInfo {
  program: WebGLProgram,
  attribLocations: {
    vertexPosition: number
  },
  uniformLocations: {
    uTime: WebGLUniformLocation | null;
    uMouse: WebGLUniformLocation | null;
    uResolution: WebGLUniformLocation | null;
  }
}

interface Buffers {
  position: WebGLBuffer,
}

interface Vec2 {
  x: number,
  y: number
}

interface Uniforms {
  uTime: number;
  uResolution: Vec2
  uMouse: Vec2
}

//
// creates a shader of the given type, uploads the source and
// compiles it.
//
function loadShader(
  gl : WebGLRenderingContext,
  type : number,
  source : string,
  setError : (error: string) => void,
) : WebGLShader | null {
  const shader = gl.createShader(type);
  // Send the source to the shader object

  if (!shader) {
    setError("Can't add that type of shade");
    return null;
  }

  gl.shaderSource(shader, source);
  // Compile the shader program

  gl.compileShader(shader);
  // See if it compiled successfully

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    setError(`An error occurred compiling the shaders: ${gl.getShaderInfoLog(shader)}`);
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

const initShaderProgram = (
  gl : WebGLRenderingContext,
  vsSource : string, fsSource : string,
  setError : (error: string) => void,
) => {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource, setError);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource, setError);

  if (!vertexShader || !fragmentShader) return null;

  // Create the shader program
  const shaderProgram = gl.createProgram();

  if (!shaderProgram) {
    setError('Couldn\'t create shader program');
    return null;
  }

  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  // If creating the shader program failed, alert
  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    setError(`Unable to initialize the shader program: ${gl.getProgramInfoLog(shaderProgram)}`);
    return null;
  }

  return shaderProgram;
};

function initBuffers(gl : WebGLRenderingContext) : Buffers | null {
  // Create a buffer for the square's positions.
  const positionBuffer = gl.createBuffer();
  if (!positionBuffer) return null;

  // Select the positionBuffer as the one to apply buffer
  // operations to from here out.
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  // Now create an array of positions for the square.
  const positions = [
    1.0, 1.0,
    -1.0, 1.0,
    1.0, -1.0,
    -1.0, -1.0,
  ];

  // Now pass the list of positions into WebGL to build the
  // shape. We do this by creating a Float32Array from the
  // JavaScript array, then use it to fill the current buffer.
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(positions),
    gl.STATIC_DRAW,
  );

  return {
    position: positionBuffer,
  };
}

function drawScene(
  gl : WebGLRenderingContext,
  programInfo : ProgramInfo,
  buffers : Buffers,
  uniforms : Uniforms,
) {
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.clearColor(0.0, 0.0, 0.0, 1.0); // Clear to black, fully opaque
  gl.clearDepth(1.0); // Clear everything
  gl.enable(gl.DEPTH_TEST); // Enable depth testing
  gl.depthFunc(gl.LEQUAL); // Near things obscure far things

  // Clear the canvas before we start drawing on it.

  // eslint-disable-next-line no-bitwise
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // Tell WebGL how to pull out the positions from the position
  // buffer into the vertexPosition attribute.
  {
    const numComponents = 2; // pull out 2 values per iteration
    const type = gl.FLOAT; // the data in the buffer is 32bit floats
    const normalize = false; // don't normalize
    const stride = 0; // how many bytes to get from one set of values to the next
    // 0 = use type and numComponents above
    const offset = 0; // how many bytes inside the buffer to start from
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
    gl.vertexAttribPointer(
      programInfo.attribLocations.vertexPosition,
      numComponents,
      type,
      normalize,
      stride,
      offset,
    );
    gl.enableVertexAttribArray(
      programInfo.attribLocations.vertexPosition,
    );
  }

  // Tell WebGL to use our program when drawing
  gl.useProgram(programInfo.program);

  // Set the shader uniforms
  {
    gl.uniform1f(programInfo.uniformLocations.uTime, uniforms.uTime);
    gl.uniform2fv(programInfo.uniformLocations.uMouse, [uniforms.uMouse.x, uniforms.uMouse.y]);
    gl.uniform2fv(programInfo.uniformLocations.uResolution,
      [uniforms.uResolution.x, uniforms.uResolution.y]);

    const offset = 0;
    const vertexCount = 4;
    gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
  }
}

interface Props {
  className?: string,
  vertex: string,
  fragment: string
}

const GlslComponent = ({ className, fragment, vertex } : Props) => {
  const canvas = useRef<HTMLCanvasElement>(null);

  const addError = (error : string) => {
    console.log(error);
  };

  useEffect(() => {
    if (!canvas.current) return;
    // Initialize the GL context
    const gl = canvas.current.getContext('webgl');

    if (!gl) {
      addError('WebGL not supported');
      return;
    }
    const shaderProgram = initShaderProgram(gl, vertex, fragment, addError);
    if (!shaderProgram) {
      addError('Couldn\'t init shader program');
      return;
    }

    const programInfo : ProgramInfo = {
      program: shaderProgram,
      attribLocations: {
        vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
      },
      uniformLocations: {
        uTime: gl.getUniformLocation(shaderProgram, 'u_time'),
        uMouse: gl.getUniformLocation(shaderProgram, 'u_mouse'),
        uResolution: gl.getUniformLocation(shaderProgram, 'u_resolution'),
      },
    };

    const buffers = initBuffers(gl);
    if (!buffers) {
      addError('Buffers Couldn\'t be initiated');
    }

    const startTime = Date.now();

    const uniforms : Uniforms = {
      uTime: 0,
      uMouse: { x: 0, y: 0 },
      uResolution: { x: canvas.current.width, y: canvas.current.height },
    };

    document.addEventListener('mousemove', (e) => {
      uniforms.uMouse = {
        x: e.pageX - (canvas.current?.offsetLeft || 0),
        y: -(e.pageY - uniforms.uResolution.y - (canvas.current?.offsetTop || 0)),
      };
    });

    const onElementResize = () => {
      if (canvas.current) {
        canvas.current.height = canvas.current.clientHeight;
        canvas.current.width = canvas.current.clientWidth;
        uniforms.uResolution = {
          x: canvas.current.width,
          y: canvas.current.height,
        };
      }
    };

    new ResizeObserver(onElementResize).observe(canvas.current);

    function startRender() {
      if (gl !== null && buffers) {
        requestAnimationFrame(startRender);

        uniforms.uTime = (Date.now() - startTime) / 1000;

        drawScene(gl, programInfo, buffers, uniforms);
      }
    }

    startRender();
  }, [fragment, vertex]);

  return <canvas ref={canvas} className={className} />;
};

GlslComponent.defaultProps = {
  className: '',
};

export default GlslComponent;
