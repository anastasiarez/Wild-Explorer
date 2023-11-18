import "./App.css";
import { Route, Routes } from "react-router-dom";
import IndexPage from "./components/IndexPage";
import LoginPage from "./components/LoginPage";
import Layout from "./Layout";
import RegisterPage from "./components/RegisterPage";
import axios from "axios";
import { UserContextProvider } from "./UserContext";
import AccountPage from "./components/PlacesPage"
import PlacesPage from "./components/PlacesPage";


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
        <Route path="/account" element={<AccountPage />}>
        <Route index element={<AccountPage />} />
        <Route path=":subpage/:action" element={<AccountPage />} />
        <Route path="bookings" element={<AccountPage />} />
        <Route path="places" element={<PlacesPage />} /> {/* Use PlacesPage for the /account/places route */}
      </Route>

      </Route>
    </Routes>
    </UserContextProvider>
    
  );
}

export default App;
