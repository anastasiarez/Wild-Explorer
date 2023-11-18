import { Link, Navigate } from "react-router-dom";
import React, { useContext, useState } from "react";
import axios from "axios";
import { UserContext } from "../UserContext";

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [redirect, setRedirect] = useState(false);
  const {setUser} = useContext(UserContext);


  async function handleLoginSubmit (ev) {
    ev.preventDefault();
    try {
      const data = await axios.post('/login', {email, password});
      console.log('Server Response:', data);
      setUser(data.data);
      alert("Login successfull");
      setRedirect(true)
    } catch (e) {
      alert("Login failed");
    }
  }

  if (redirect) {
    return <Navigate to={'/'} />
  }
  return (
    <div className="mt-4 grow flex items-center justify-around">
      <div className="mb-60">
        <h1 className="text-4xl text-center mb-4">Login</h1>

        <form className="max-w-md mx-auto" onSubmit={handleLoginSubmit}>
          <input type="email" 
          placeholder="example@email.com" 
          value={email} 
          onChange={ev => setEmail(ev.target.value)} />
          
          <input type="password" 
          placeholder="password" 
          value={password} 
          onChange={ev => setPassword(ev.target.value)}  />
          
          <button className="bg-secondary px-16 py-2 rounded-2xl">Login</button>

          <div className="text-center py-2 text-gray-500">
            Create a free acount. </div>
            
            <div>
            <Link className="bg-secondary px-16 py-2 rounded-2xl" to={'/register'}>Register</Link>
            </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
