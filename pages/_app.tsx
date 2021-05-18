import { AppProps } from 'next/dist/next-server/lib/router/router';
import '../styles/style.css';

// This default export is required in a new `pages/_app.js` file.
export default function MyApp({ Component, pageProps } : AppProps) {
  // eslint-disable-next-line react/jsx-props-no-spreading
  return <Component {...pageProps} className="main" />;
}
