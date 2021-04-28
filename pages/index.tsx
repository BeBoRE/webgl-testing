import Head from 'next/head';
import React, { useEffect, useRef, useState } from 'react';
import { mat4 } from 'gl-matrix';
import vertex from '../shaders/vertex.glsl';
import fragment from '../shaders/fragment.glsl';

interface ProgramInfo {
  program: WebGLProgram,
  attribLocations: {
    vertexPosition: number,
    vertexColor: number
  },
  uniformLocations: {
    projectionMatrix: WebGLUniformLocation,
    modelViewMatrix: WebGLUniformLocation,
  },
}

interface Buffers {
  position: WebGLBuffer,
  color: WebGLBuffer
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

  const colorBuffer = gl.createBuffer();
  if (!colorBuffer) return null;

  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);

  const colors = [
    1.0, 1.0, 1.0, 1.0, // white
    1.0, 0.0, 0.0, 1.0, // red
    0.0, 1.0, 0.0, 1.0, // green
    0.0, 0.0, 1.0, 1.0, // blue
  ];

  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(colors),
    gl.STATIC_DRAW,
  );

  return {
    position: positionBuffer,
    color: colorBuffer,
  };
}

function drawScene(gl : WebGLRenderingContext, programInfo : ProgramInfo, buffers : Buffers) {
  gl.clearColor(0.0, 0.0, 0.0, 1.0); // Clear to black, fully opaque
  gl.clearDepth(1.0); // Clear everything
  gl.enable(gl.DEPTH_TEST); // Enable depth testing
  gl.depthFunc(gl.LEQUAL); // Near things obscure far things

  // Clear the canvas before we start drawing on it.

  // eslint-disable-next-line no-bitwise
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // Create a perspective matrix, a special matrix that is
  // used to simulate the distortion of perspective in a camera.
  // Our field of view is 45 degrees, with a width/height
  // ratio that matches the display size of the canvas
  // and we only want to see objects between 0.1 units
  // and 100 units away from the camera.

  const fieldOfView = (45 * Math.PI) / 180; // in radians
  const aspect = gl.canvas.width / gl.canvas.height;
  const zNear = 0.1;
  const zFar = 100.0;
  const projectionMatrix = mat4.create();

  // note: glmatrix.js always has the first argument
  // as the destination to receive the result.
  mat4.perspective(projectionMatrix,
    fieldOfView,
    aspect,
    zNear,
    zFar);

  // Set the drawing position to the "identity" point, which is
  // the center of the scene.
  const modelViewMatrix = mat4.create();

  // Now move the drawing position a bit to where we want to
  // start drawing the square.

  mat4.translate(modelViewMatrix, // destination matrix
    modelViewMatrix, // matrix to translate
    [-0.0, 0.0, -6.0]); // amount to translate

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

  {
    const numComponents = 4; // pull out 2 values per iteration
    const type = gl.FLOAT; // the data in the buffer is 32bit floats
    const normalize = false; // don't normalize
    const stride = 0; // how many bytes to get from one set of values to the next
    // 0 = use type and numComponents above
    const offset = 0; // how many bytes inside the buffer to start from
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color);
    gl.vertexAttribPointer(
      programInfo.attribLocations.vertexColor,
      numComponents,
      type,
      normalize,
      stride,
      offset,
    );
    gl.enableVertexAttribArray(
      programInfo.attribLocations.vertexColor,
    );
  }

  // Tell WebGL to use our program when drawing

  gl.useProgram(programInfo.program);

  // Set the shader uniforms

  gl.uniformMatrix4fv(
    programInfo.uniformLocations.projectionMatrix,
    false,
    projectionMatrix,
  );
  gl.uniformMatrix4fv(
    programInfo.uniformLocations.modelViewMatrix,
    false,
    modelViewMatrix,
  );

  {
    const offset = 0;
    const vertexCount = 4;
    gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
  }
}

let i = 0;
const getUnique = () => { i += 1; return i; };

const Home = () => {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [errorList, setError] = useState<string[]>([]);

  const addError = (error : string) => {
    setError((state) => {
      console.log(error);
      state.push(error);
      return state;
    });
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

    const projectionMatrix = gl.getUniformLocation(shaderProgram, 'uProjectionMatrix');
    const modelViewMatrix = gl.getUniformLocation(shaderProgram, 'uModelViewMatrix');

    if (!projectionMatrix) {
      addError('No projectionMatrix location found');
      return;
    }

    if (!modelViewMatrix) {
      addError('No modelViewMatrix location found');
      return;
    }

    const programInfo : ProgramInfo = {
      program: shaderProgram,
      attribLocations: {
        vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
        vertexColor: gl.getAttribLocation(shaderProgram, 'aVertexColor'),
      },
      uniformLocations: {
        projectionMatrix,
        modelViewMatrix,
      },
    };

    const buffers = initBuffers(gl);
    if (!buffers) {
      addError('Buffers Couldn\'t be initiated');
      return;
    }

    drawScene(gl, programInfo, buffers);
  }, []);

  return (
    <>
      <Head>
        <title>GLSL testing</title>
      </Head>
      <canvas ref={canvas} width="640" height="480" />
      {errorList.map((error) => <p key={getUnique()}>{error}</p>)}
    </>
  );
};

export default Home;
