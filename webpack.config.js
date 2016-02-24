var path = require('path');

module.exports = {
    externals: {
        react: 'react',
        'react-dom': 'react-dom',
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
