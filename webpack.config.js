var path = require('path');

module.exports = {
    externals: {
        react: 'React',
        'react-dom': 'ReactDOM',
    },
    output: {
        filename: 'CreditCard.js',
        libraryTarget: 'var',
        library: 'CreditCard'
    },
    resolve: {
      root: [
        path.resolve('./lib')
      ]
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
