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
  assetPrefix: 'webgl-testing',
  basePath: 'webgl-testing',
};
