var webpack      = require('webpack');
var autoprefixer = require('autoprefixer');

module.exports = {
    entry: [
        'webpack-dev-server/client?http://localhost:8080',
        'webpack/hot/only-dev-server',
        __dirname + '/client/src/index.jsx'
    ],
    module: {
        loaders: [{
            test: /\.jsx?$/,
            exclude: /node_modules/,
            loader: 'react-hot!babel'
        },{
            test: /\.scss?$/,
            exclude: /node_modules/,
            loader: 'style!css!postcss!sass'
        }]
    },
    resolve: {
        extensions: ['', '.js', '.jsx']
    },
    output: {
        path: './client/public/js',
        publicPath: '/js/',
        filename: 'app-bundle.js'
    },
    devtool: 'cheap-eval-sourcemaps',
    devServer: {
        contentBase: './client/public',
        port: 8000,
        keepAlive: true,
        historyApiFallback: true,
        progress: true,
        watch: true,
        hot: true
    },
    postcss: function() {
        return [autoprefixer({ browsers: ['last 3 versions'] })];
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ]

};