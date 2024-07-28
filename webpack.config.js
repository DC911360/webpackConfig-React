const path = require('path')
const EslintWebpackPlugin = require('eslint-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

//进程的环境变量 process.env.NODE_ENV 获取 cross-env 定义的环境变量
const isProduction = process.env.NODE_ENV === 'production' ? true : false

//返回样式处理 loader 函数
const getStyleLoaders = (pre) => {
    return [
        isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
        'css-loader',
        {
            loader: 'postcss-loader',
            options: {
                postcssOptions: {
                    plugins: [
                        'postcss-preset-env'
                    ]
                }
            }
        },
        pre
    ].filter(Boolean)
}
module.exports = {
    entry: './src/main.js', //入口文件
    output: { //出口
        path: isProduction ? path.resolve(__dirname, "./dist") : undefined, //路径
        filename: isProduction ? "static/js/[name].[contenthash:10].js" : "static/js/[name].js", //文件名称
        chunkFilename: isProduction ? "static/js/[name].[contenthash:10].chunk.js" : "static/js/[name].chunk.js", //动态导入， node_moudle
        assetModuleFilename: "static/media/[hash:10][ext][query]",// 静态资源 
        clean: true,
    },
    module: {
        rules: [
            //处理css
            {
                test: /\.css$/,
                use: getStyleLoaders()
            },

            {
                test: /\.less$/,
                use: getStyleLoaders('less-loader')
            },
            {
                test: /\.s[ac]ss$/,
                use: getStyleLoaders('sass-loader')
            },
            {
                test: /\.styl$/,
                use: getStyleLoaders('stylus-loader')
            },
            // 处理图片
            {
                test: /\.(jpe?g|png|gif|webp|svg)$/,
                type: 'asset',
                parser: {
                    dataUrlCondition: {
                        maxSize: 10 * 1024, // 图片小于 10kb 转换为 base64 格式, 
                    }
                }
            },
            //处理其他资源
            {
                test: /\.(woff2?|ttf)$/,
                type: "asset/resource" // asset:可以处理成base64 输出，  asset/resource 原封不动输出
            },
            //处理js
            {
                test: /\.jsx?$/,
                include: path.resolve(__dirname, "./src"),
                loader: "babel-loader",
                options: {
                    cacheDirectory: true,
                    cacheCompression: false,
                    plugins: [
                        !isProduction && "react-refresh/babel" // 激活 JS    HMR
                    ].filter(Boolean)
                }

            }
        ],
    },
    plugins: [
        // new NodePolyfillPlugin(),
        new EslintWebpackPlugin({
            context: path.resolve(__dirname, '../src'), // 处理文件的路径
            exclude: "node_modules", // 排除文件不进行处理
            cache: true, // 开启缓存
            cacheLocation: path.resolve(__dirname, "./node_modules/.cache/.eslintcache") //缓存文件存放的地址
            //thread 多线程打包
        }),

        //处理 html 文件
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, './public/index.html')
        }),

        // //开发环境下 React 热更新 // 激活 JS    HMR 
        // new ReactRefreshWebpackPlugin({}),

        isProduction && new MiniCssExtractPlugin({
            filename: "static/css/[name].[contenthash:10].css",
            chunkFilename: "static/css/[name].[contenthash:10].chunk.css",
        }),
        isProduction && new CopyPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, "./public"),
                    to: path.resolve(__dirname, "./dist"),
                    globOptions: {
                        //忽略 piblic 中 index.html 文件
                        ignore: ['**/index.html',],
                    },
                },

            ],
        }),
        !isProduction && new ReactRefreshWebpackPlugin()

    ].filter(Boolean),
    mode: isProduction ? 'production' : 'development', // 生成环境会自动压缩 html文件
    devtool: isProduction ?'source-map':'cheap-module-source-map',
    optimization: {
        splitChunks: {
            chunks: 'all',
            cacheGroups:{
                //react react-dom react-dom-router  一起打包成一js 文件
                react:{
                    test:/[\\/]node_modules[\\/]react(.*)?[\\/]/,
                    name:'chunk-react',
                    priority:40,
                },
                //antd 单独打包
                antd:{
                    test:/[\\/]node_modules[\\/]antd(.*)?/,
                    name:'chunk-antd',
                    priority:30,
                },   
                //剩余的 node_module 打包
                libs:{
                    test:/[\\/]node_modules[\\/]/,
                    name:'chunk-libs',
                    priority:10,
                }

            }
        },
        runtimeChunk: {
            name: (entrypoint) => `runtime-${entrypoint.name}.js `
        },

        //是否进行压缩 
        minimize:true,
        minimizer: [
            // 在 webpack@5 中，你可以使用 `...` 语法来扩展现有的 minimizer（即 `terser-webpack-plugin`），将下一行取消注释
            // `...`,
            new CssMinimizerPlugin(), //css 压缩
            new TerserPlugin(), // js   压缩

            //压缩图片
            // new ImageMinimizerPlugin({
            //     implementation:ImageMinimizerPlugin.imageminGenerate,
            //     options: {
            //         // Lossless optimization with custom option
            //         // Feel free to experiment with options for better result for you
            //         plugins: [
            //           ['gifsicle', { interlaced: true }],
            //           ['jpegtran', { progressive: true }],
            //           ['optipng', { optimizationLevel: 5 }],
            //           // Svgo configuration here https://github.com/svg/svgo#configuration
            //           [
            //             'svgo',
            //             {
            //               plugins:[
            //                 "preset-default",
            //                 "prefixIds",
            //                 {
            //                     name: 'removeViewBox',
            //                     params: {
            //                         xmlnsOrder: "alphabetical"
            //                     },
            //                 }
            //               ],
            //             },
            //           ],
            //         ],
            //       },
            // }),
        ],
    },
    devServer: {
        host: 'localhost',
        port: 3000,
        open: true,
        hot: true,
        historyApiFallback: true, //解决前端路由刷新 404 问题
    },
    //webpack 解析模块加载选项
    resolve: {
        //自动补全 文件扩展名
        extensions: [".jsx", ".js", ".json"],


    },
   
    performance:false, // 关闭性能分析，提高打包速度
}