import Head from 'next/head';
import GlslCanvas from '../components/GlslCanvas';
import fragment from '../shaders/wakFragment.glsl';
import vertex from '../shaders/vertex.glsl';

const Wak = () => (
  <>
    <Head>
      <title>GLSL testing</title>
    </Head>
    <GlslCanvas fragment={fragment} vertex={vertex} className="canvas" />
  </>
);

export default Wak;
