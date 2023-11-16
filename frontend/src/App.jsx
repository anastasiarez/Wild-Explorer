import { useState } from 'react'
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import LoginPage from './components/LoginPage'
import RegisterPage from './components/RegisterPage'
import viteLogo from '/vite.svg'
import './App.css'
import axios from 'axios';


axios.defaults.baseURL = "http://localhost:4000";

function App() {
  const [count, setCount] = useState(0);

  return (
    <Router>
      <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path='/register' element={<RegisterPage />} />

    </Routes>
    </Router>
    


  )

}

export default App
