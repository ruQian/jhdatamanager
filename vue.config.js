module.exports = {
    publicPath: './',
    assetsDir: 'static',
    productionSourceMap: false,
     devServer: {
         port: 8080,     // 端口号
		 disableHostCheck: true,
    //     proxy: {
    //         '/api':{
    //             target:'http://jsonplaceholder.typicode.com',
    //             changeOrigin:true,
    //             pathRewrite:{
    //                 '/api':''
    //             }
    //         }
    //     }
    }
}