import React, { Suspense, lazy } from "react";
import { Link, Routes, Route } from "react-router-dom";

import { Button } from 'antd'

const Home = lazy(() => import(/* webpackChunkName:'home' */"./page/Home"));
const About = lazy(() => import(/* webpackChunkName:'about' */"./page/About"));

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
