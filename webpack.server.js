const path = require('path');
/* eslint-disable import/no-extraneous-dependencies */
const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
/* eslint-enable import/no-extraneous-dependencies */

const serverConfig = {
  mode: 'development',
  stats: 'normal',
  target: 'node',
  externals: [nodeExternals()],
  entry: {
    main: './src/server.blop',
  },
  output: {
    libraryTarget: "commonjs2",
    path: path.resolve(__dirname, 'dist'),
    filename: 'server.js',
  },
  module: {
    rules: [
      {
        test: /\.blop$/,
        use: [
          {
            loader: 'blop-language/src/loader',
            options: {
              debug: !!process.env.BLOP_DEBUG,
              strictness: 'perfect',
            },
          },
        ],
      },
      {
        test: /\.css$/i,
        use: ['null-loader'],
      },
    ],
  },
  plugins: [
    new webpack.SourceMapDevToolPlugin({}),
    new webpack.DefinePlugin({
      SERVER: true,
    }),
  ],
};

module.exports = serverConfig;
