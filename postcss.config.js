module.exports = {
    plugins: [
        require('autoprefixer')({ overrideBrowserslist: ['> 1%', 'Android >= 2.1', 'ios 7', 'firefox >= 15', 'IE 10'] }),
        require('postcss-pxtorem')({
            rootValue: 75,
            minPixelValue: 1,
            exclude: /node_modules/i,
        })
    ],
}
    