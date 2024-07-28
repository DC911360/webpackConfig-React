import  React  from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { BrowserRouter  } from 'react-router-dom'
// import 'antd/dist/antd.less'; // or 'antd/dist/antd.css'


const root = ReactDOM.createRoot(document.getElementById('app'))
root.render(
    <BrowserRouter>
        <App />
    </BrowserRouter>
);