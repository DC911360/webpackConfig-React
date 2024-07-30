import React, { Suspense, lazy } from "react";
import { Link, Routes, Route } from "react-router-dom";

import { Button } from 'antd'

// const Home = lazy(() => import(/* webpackChunkName:'home' */"./page/Home")); // chunkName:home
// const About = lazy(() => import(/* webpackChunkName:'about' */"./page/About")); //chunkName: about

/**
 * 默认的 chunk 名称 : src_page_文件夹名称_文件名称_文件扩展名_chunk.js
 */
const Home = lazy(() => import("./page/Home")); // chunkName:[默认] src_page_Home_index_jsx.chunk.js  http://localhost:3000/static/js/src_page_About_index_jsx.chunk.js
const About = lazy(() => import("./page/About")); //chunkName: [默认] src_page_About_index_jsx.chunk.js  http://localhost:3000/static/js/src_page_Home_index_jsx.chunk.js
function App() {
  return (
    <div>
      <h1>App</h1>
      <Button type="primary">Primary Button</Button>

      {/* <Home/>
            <About/> */}
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/about">About</Link>
        </li>
      </ul>

      <Suspense fallback={<div>...loading</div>}>
        <Routes>
          <Route path="/" element={<Home></Home>}></Route>
          <Route path="/about" element={<About></About>}></Route>
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;
