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
webpackConfig-React
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