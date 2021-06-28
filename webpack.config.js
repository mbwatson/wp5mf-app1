const path = require('path')
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin')

let mode = 'development'
let target = 'web'
const plugins = [
  new CleanWebpackPlugin(),
  new MiniCssExtractPlugin(),
  new HtmlWebpackPlugin({
    template: './src/index.html',
    favicon: './src/images/favicon.png',
  }),
  new ModuleFederationPlugin({
    name: 'app1',
    library: { type: 'var', name: 'app1' },
    filename: 'remoteEntry.js',
    exposes: {
      './Button': './src/components/button.js',
    },
    shared: ['react', 'react-dom'],
  }),
]

if (process.env.NODE_ENV === 'production') {
  mode = 'production'
}
if (process.env.SERVE) {
  plugins.push(new ReactRefreshWebpackPlugin())
}

module.exports = {
  mode: mode,

  target: target,

  entry: './src/index.js',

  output: {
    path: path.resolve(__dirname, 'dist'),
    assetModuleFilename: 'images/[hash][ext][query]',
    publicPath: 'https://wp5mf-app1.netlify.app/',
  },

  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        // type:
        //   "asset/inline": base-64 inline images in js bundle
        //   "asset/resource": images will be imported as separate resources
        //   "asset": webpack will determine, based on file size, whether it
        //            should base-64 inline the images or import them as assets.
        //            8kb is the default cutoff, which can be changed.
        type: 'asset',
      },
      {
        test: /\.(s[ac]|c)ss$/i,
        use: [ // these load rtl
          {
            loader: MiniCssExtractPlugin.loader,
          },
          'css-loader',
          'postcss-loader',
          'sass-loader',
        ]
      },
      {
        test: /\.jsx?$/i,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
    ]
  },

  plugins: plugins,

  resolve: {
    extensions: ['.js', '.jsx'],
  },

  devtool: 'source-map',

  devServer: {
    port: 8081,
    contentBase: './dist',
    hot: true,
  }
}
