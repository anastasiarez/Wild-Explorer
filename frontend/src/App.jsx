import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import axios from 'axios';


axios.defaults.baseURL = "http://localhost:4000";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div>
      TEST
      </div>

    </>
  )
}

export default App

TEST