module.exports = {
    entry: {
        cc: __dirname+"/src/cc.jsx"
    },
    externals: {
        react: 'react',
        'react-dom': 'react-dom',
    },
    output: {
        path: __dirname+'/dist/',
        filename: '[name].js',
        libraryTarget: 'commonjs2'
    },
    plugins: [],
    module: {
        loaders: [
            {
                test: /\.(jsx|js)$/,
                loaders: ['babel']
            }
        ]
    }
}
