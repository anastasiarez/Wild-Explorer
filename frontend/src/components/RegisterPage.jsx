import { Link, Navigate } from "react-router-dom";
import React, { useState } from "react";
import axios from "axios";

const RegisterPage = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [redirect, setRedirect] = useState(false);

    const registerUser = async (e) => {
        e.preventDefault();
        if (!name || !email || !password) {
            alert('Please fill in all fields.');
            return;
        }

        // Email validation using a simple regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Please enter a valid email address.');
            return;
        }

        try {
            await axios.post("/register", {
                name,
                email,
                password,
            });
            alert('Registration successful');

            // Log in the user after successful registration
            const loginData = await axios.post("/login", { email, password });
            console.log("Server Response:", loginData);

            setRedirect(true);
        } catch (error) {
            alert("Registration failed. Please try again");
        }
    };

    if (redirect) {
        // Redirect to the home page after successful registration and login
        return <Navigate to={"/"} />;
    }

    return (
        <div className="mt-4 grow flex items-center justify-around">
            <div className="mb-60">
                <h1 className="text-4xl text-center mb-4">Register</h1>
                <form className="max-w-md mx-auto" onSubmit={registerUser}>
                    <input
                        type="text"
                        placeholder="your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <input
                        type="email"
                        placeholder="example@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button className="primary">Register</button>
                    <div className="text-center py-2 text-gray-500">
                        Already a member.{" "}
                        <Link className="underline text-bn" to={"/login"}>
                            Login
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RegisterPage;