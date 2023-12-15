import { Outlet } from "react-router-dom";
import Header from "./Header";
import { useState } from "react";
import Search from "./Search";

const Layout = ({ setSearchResults, setSearchHitEnter }) => {
  const [searchData, SetSearchData] = useState([]);

  const handleSearch = (newSearchData) => {
    SetSearchData(newSearchData);
  };

  return (
    <div className="py-4 px-8 flex flex-col min-h-screen">
      <Header onSearch={handleSearch} setSearchResults={setSearchResults} setSearchHitEnter={setSearchHitEnter} />
      <Outlet />
    </div>
  );
};

export default Layout;
