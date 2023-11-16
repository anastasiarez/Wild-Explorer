import { Link } from "react-router-dom";
import React, { useState } from "react";
import axios from "axios";

async function handleLoginSubmit(ev){
  ev.preventDefault();
  try {
    await axios.post('/login', {email, password});
    alert("Login successfull");
  } catch (e) {
    alert("Login failed");
  }
}


const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  async function handleLoginSubmit (ev) {
    ev.preventDefault();
    try {
      await axios.post('/login', {email, password});
      alert("Login successfull");
    } catch (e) {
      alert("Login failed");
    }
  }
  return (
    <div className="mt-4 grow flex items-center justify-around">
      <div className="mb-60">
        <h1 className="text-4xl text-center mb-4">Login</h1>

        <form className="max-w-md mx-auto" onSubmit={handleLoginSubmit}>
          <input type="email" 
          placeholder="example@email.com" 
          value={email} onChange={ev => setEmail(ev.target.value)} />
          
          <input type="password" 
          placeholder="password" 
          value={password} onChange={ev => setPassword(ev.target.value)}  />
          
          <button className="primary">Login</button>
          <div className="text-center py-2 text-gray-500">
            Create a free acount. <Link className="underline text-bn" to={'/register'}>Register</Link></div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
