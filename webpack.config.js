module.exports = {
    entry: {
        cc: __dirname+"/src/cc.jsx"
    },
    externals: {
        react: 'React',
        'react-dom': 'ReactDOM',
    },
    output: {
        path: __dirname+'/dist/',
        filename: '[name].js',
        libraryTarget: 'umd'
    },
    module: {
        loaders: [
            {
                test: /\.(jsx|js)$/,
                loaders: ['babel']
            }
        ]
    }
}
