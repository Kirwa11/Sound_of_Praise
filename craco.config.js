const CompressionPlugin = require('compression-webpack-plugin');

module.exports = {
  webpack: {
    plugins: [
      new CompressionPlugin({
        algorithm: 'gzip',
        test: /\.(js|css|html|svg)$/,
        threshold: 10240,
        minRatio: 0.8,
      }),
      new CompressionPlugin({
        filename: '[path][base].br',
        algorithm: 'brotliCompress',
        test: /\.(js|css|html|svg)$/,
        compressionOptions: { level: 11 },
        threshold: 10240,
        minRatio: 0.8,
      }),
    ],
    configure: {
      optimization: {
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name(module) {
                const packageName = module.context.match(
                  /[\\/]node_modules[\\/](.*?)([\\/]|$)/
                )[1];
                return `npm.${packageName.replace('@', '')}`;
              },
            },
          },
        },
      },
    },
  },
};
