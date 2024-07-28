# webpackConfig-React

a webpackConfig-React record

#参考 [webpack-配置](https://www.webpackjs.com/configuration/),[webpack-Loaders](https://www.webpackjs.com/loaders//),[webpack-Plugins](https://www.webpackjs.com/plugins/)

### install

```
$ git clone https://github.com/DC911360/webpackConfig-React.git
$ npm install
$ npm start/ npm run dev
$ npm run build
```

```
webpackConfig-React project-tree
├─ .eslintignore          //使用 vscode 插件:eslint ,忽略检查文件配置
├─ .gitignore
├─ .eslintrc.js           //webpack plugin: eslint 配置
├─ README.md
├─ babel.config.js
├─ dist              // npm run build 生成  dist 文件
│  ├─ favicon.ico
│  ├─ index.html
│  └─ static
│     ├─ css
│     │  ├─ home.7aa30cee78.chunk.css //额外的 css 文件
│     │  └─ home.7aa30cee78.chunk.css.map
│     └─ js
│        ├─ about.56369a4b12.chunk.js //懒加载 文件
│        ├─ about.56369a4b12.chunk.js.map
│        ├─ chunk-antd.7787e8ea5a.js // antd 相关的 chunk
│        ├─ chunk-antd.7787e8ea5a.js.map
│        ├─ chunk-libs.ba701185bd.js
│        ├─ chunk-libs.ba701185bd.js.LICENSE.txt
│        ├─ chunk-libs.ba701185bd.js.map
│        ├─ chunk-react.246a71b3ae.js // react 相关的 chun
│        ├─ chunk-react.246a71b3ae.js.LICENSE.txt
│        ├─ chunk-react.246a71b3ae.js.map
│        ├─ home.49628e06b7.chunk.js  //懒加载 文件
│        ├─ home.49628e06b7.chunk.js.map
│        ├─ main.2282387a02.js
│        ├─ main.2282387a02.js.map
│        ├─ runtime-main.js .1f5cb7f953.js  //管理模块之间的依赖，缓存代码，提高效率
│        └─ runtime-main.js .1f5cb7f953.js.map
├─ package-lock.json
├─ package.json
├─ public
│  ├─ favicon.ico
│  └─ index.html
├─ src
│  ├─ App.jsx
│  ├─ main.js
│  └─ page
│     ├─ About
│     │  └─ index.jsx
│     └─ Home
│        ├─ index.jsx
│        └─ index.less
├─ webpack.config.js
├─ webpack.dev.js
└─ webpack.pro.js

```

### webpack.config.js

- entry //入口文件
- output //出口文件
- module //loader 加载器
- plugins //plugin 插件
- mode // 开发/生产模式
- devtool // sourceMap
- optimization // 优化，分割
- devServer // 开发服务
- resolve // 自动补全 文件扩展名
- performance // 关闭性能分析，提高打包速度

### 代码引用

```
const path = require('path')
const EslintWebpackPlugin = require('eslint-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin'); // 开发模式 HMR

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
        // CopyPlugin 复制 public 中的资源 到 dist 文件
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
        //开发环境中 HMR
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

```

### some probloms

package.json 文件

```
"dev": "cross-env NODE_ENV=development webpack server --config ./webpack.config.js",
"build": "cross-env NODE_ENV=production webpack --config ./webpack.config.js"

```

### part of module dependenies

```
"devDependencies": {
    "@babel/core": "^7.24.9",
    "@pmmmwh/react-refresh-webpack-plugin": "^0.5.15",
    "babel-loader": "^9.1.3",
    "babel-preset-react-app": "^10.0.1",
    "copy-webpack-plugin": "^12.0.2",
    "cross-env": "^7.0.3",
    "css-loader": "^7.1.2",
    "css-minimizer-webpack-plugin": "^7.0.0",
    "eslint-config-react-app": "^7.0.1",
    "eslint-webpack-plugin": "^4.2.0",
    "html-webpack-plugin": "^5.6.0",
    "image-minimizer-webpack-plugin": "^4.0.2",
    "less": "^4.2.0",
    "less-loader": "^12.2.0",
    "mini-css-extract-plugin": "^2.9.0",
    "path-browserify": "^1.0.1",
    "postcss": "^8.4.40",
    "postcss-loader": "^8.1.1",
    "postcss-preset-env": "^9.6.0",
    "react-refresh": "^0.14.2",
    "sass": "^1.77.8",
    "sass-loader": "^15.0.0",
    "scss": "^0.2.4",
    "scss-loader": "^0.0.1",
    "style-loader": "^4.0.0",
    "stylus": "^0.63.0",
    "stylus-loader": "^8.1.0",
    "terser-webpack-plugin": "^5.3.10",
    "webpack": "^5.93.0",
    "webpack-cli": "^4.10.0",
    "webpack-dev-server": "^4.15.2"
}
"dependencies": {
    "antd": "^5.19.3",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.25.1"
  },

```
