import { useState } from "react";
import "./App.css";
import axios from "axios";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import IndexPage from "./components/IndexPage";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import Layout from "./Layout";
import AccountPage from "./components/PlacesPage"
import PlacesPage from "./components/PlacesPage";
import { UserContextProvider } from "./UserContext";


axios.defaults.baseURL = "http://localhost:4000/";
axios.defaults.withCredentials = true;

function App() {
  return (
    <UserContextProvider>
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<IndexPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/account/:subpage/:action" element={<AccountPage />}/>
      </Route>
    </Routes>
    </UserContextProvider>
    
  );
}

export default App;
