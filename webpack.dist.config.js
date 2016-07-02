var webpack      = require('webpack');
var autoprefixer = require('autoprefixer');

module.exports = {
    entry: __dirname + '/client/src/index.jsx',
    module: {
        loaders: [{
            test: /\.jsx?$/,
            exclude: /node_modules/,
            loader: 'babel'
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
        filename: 'app-bundle.js'
    },
    devtool: 'source-map',
    postcss: function() {
        return [autoprefixer({ browsers: ['last 3 versions'] })];
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production')
            }
        }),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin()
    ]

};