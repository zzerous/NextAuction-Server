const path = require('path')

module.exports = {
    contentBase: path.resolve(__dirname, '../static'),
    host: '0.0.0.0',
    port: 3000,
    compress: true,
    historyApiFallback: true,
    hot: true,
    inline: true,
    open: true,
}
