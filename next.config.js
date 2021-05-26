const isDebug = process.env.NODE_ENV !== 'production';

module.exports = {
  webpack: (config) => {
    // Note: we provide webpack above so you should not `require` it
    // Perform customizations to webpack config
    config.module.rules.push(
      {
        test: /\.(frag|vert|glsl)$/,
        use: [
          {
            loader: 'raw-loader',
            options: {},
          },
        ],
      },
    );

    // Important: return the modified config
    return config;
  },
  future: {
    webpack5: true,
  },
  assetPrefix: !isDebug ? '/webgl-testing' : undefined,
  basePath: !isDebug ? '/webgl-testing' : undefined,
};
