const path = require('path');
const slsw = require('serverless-webpack');
const nodeExternals = require('webpack-node-externals');

// const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const entries = {};
Object.keys(slsw.lib.entries).forEach((key) => {
  if (!slsw.lib.entries[key].match(/\.py$/)) {
    entries[key] = slsw.lib.entries[key];
  }
});

module.exports = {
  // we exclude all node dependencies
  externals: [nodeExternals()],
  mode: slsw.lib.webpack.isLocal ? 'development' : 'production',
  devtool: slsw.lib.webpack.isLocal ? 'cheap-module-eval-source-map' : 'source-map',
  optimization: {
    // set false if We no not want to minimize our code.
    minimize: true,
  },
  performance: {
    // Turn off size warnings for entry points
    hints: false,
  },
  // entry: slsw.lib.entries,
  entry: entries,
  // devtool: 'source-map',
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
    alias: {
      '@constants': path.resolve(__dirname, './constants'),
      '@libs': path.resolve(__dirname, './src/libs'),
      '@connectors': path.resolve(__dirname, './src/connectors'),
      '@typings': path.resolve(__dirname, './src/typings'),
    },
  },
  output: {
    libraryTarget: 'commonjs',
    path: path.join(__dirname, '.webpack'),
    filename: '[name].js',
  },
  target: 'node',
  module: {
    rules: [
      // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
      {
        test: /\.(tsx?)$/,
        loader: 'ts-loader',
        exclude: [
          [
            path.resolve(__dirname, 'node_modules'),
            path.resolve(__dirname, '.serverless'),
            path.resolve(__dirname, '.webpack'),
          ],
        ],
        options: {
          transpileOnly: true,
          experimentalWatchApi: true,
        },
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: __dirname,
        exclude: [
          [
            path.resolve(__dirname, 'node_modules'),
            path.resolve(__dirname, '.serverless'),
            path.resolve(__dirname, '.webpack'),
          ],
        ],
      },
    ],
  },
  plugins: [
    new CopyWebpackPlugin([{ from: './resources/**/*.py' }], {
      logLevel: 'error',
    }),
    // new ForkTsCheckerWebpackPlugin({
    //   eslint: true,
    //   eslintOptions: {
    //     cache: true
    //   }
    // }),
  ],
}
