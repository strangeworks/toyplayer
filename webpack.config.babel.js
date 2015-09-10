import webpack from 'webpack';
import path from 'path';

const buildPath = path.resolve(__dirname, 'dist');
const nodeModulesPath = path.resolve(__dirname, 'node_modules');

export default {
  //Entry points to the project
  entry: [
    'webpack/hot/dev-server',
    'webpack/hot/only-dev-server',
    path.join(__dirname, 'src', '/javascripts/', 'main.js')
  ],
  //Config options on how to interpret requires imports
  resolve: {
    extensions: ["", ".js"],
    alias: {
      styles: path.join(__dirname, 'src', 'styles')
    }
  },
  //Server Configuration options
  devServer: {
    contentBase: './dist',  //Relative directory for base of server
    devtool: 'eval',
    hot: true,        //Live-reload
    inline: true,
    port: 3000        //Port Number
  },
  devtool: 'eval',
  output: {
    path: buildPath,    //Path of output file
    filename: 'bundle.js'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: ['babel-loader?stage=0'],
        exclude: [nodeModulesPath]
      },
      {
        test: /\.scss$/,
        loaders: ['style', 'css', 'autoprefixer-loader?browsers=last 2 versions', 'sass?precision=10&outputStyle=expanded&sourceMap=true']
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: "url-loader?limit=10000&minetype=application/font-woff"
      },
      {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: "file-loader"
      }
    ]
  }
};
