const webpack = require('webpack');
const path = require('path');

module.exports = {
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  entry: {
    seedsontable: './src/index.ts',
  },
  output: {
    path: path.join(__dirname, 'dist/web'),
    filename: '[name].js',
    library: 'seedsontable',
    libraryTarget: 'umd',
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  plugins: [
    new webpack.optimize.AggressiveMergingPlugin(),
  ],
  externals: [
    {
      handsontable: 'Handsontable',
    },
  ],
};
