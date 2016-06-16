export default {

    env: {
        value: 'development',
        isProduction: false
    },
    distroPath: './dist',
    webpack: {
        entry: './src/js/index.js',
        dest: './.tmp/js',
        output: {
            path: __dirname,
            filename: 'bundle.js'
        },
        debug: false,
        module: {
            loaders: [{
                test: /\.js?$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            }, {
                test: /\.json$/,
                loader: 'json-loader'
            }]
        }
    }

};
