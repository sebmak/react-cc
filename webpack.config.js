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
        libraryTarget: 'var',
        library: '[name]'
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
