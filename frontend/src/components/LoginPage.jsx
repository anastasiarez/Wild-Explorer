import { Link, Navigate } from "react-router-dom";
import React, { useContext, useState } from "react";
import axios from "axios";
import { UserContext } from "../UserContext";

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [redirect, setRedirect] = useState(false);
    const { setUser } = useContext(UserContext);

    async function handleLoginSubmit(ev) {
        ev.preventDefault();

        if (!email || !password) {
            alert("Please enter both email and password.");
            return;
        }


        try {
            const data = await axios.post('/login', { email, password });

            setUser(data.data);
            setRedirect(true);
        } catch (error) {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                if (error.response.status === 401) {
                    // Incorrect email or password
                    alert("Incorrect email or password. Please try again.");
                } else {
                    // Other server error
                    alert("Login failed. Please try again later.");
                }
            } else if (error.request) {
                // The request was made but no response was received
                alert("No response from the server. Please try again later.");
            } else {
                // Something happened in setting up the request that triggered an Error
                alert("An unexpected error occurred. Please try again later.");
            }
        }
    }

    if (redirect) {
        return <Navigate to={'/'} />;
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
                        onChange={ev => setPassword(ev.target.value)} />

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