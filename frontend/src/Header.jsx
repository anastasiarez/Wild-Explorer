import { Link, useLocation } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "./UserContext.jsx";
import Search from "./Search.jsx";

const Header = ({ onSearch, setSearchResults, setSearchButtonClick }) => {
  const { user } = useContext(UserContext);
  const location = useLocation();

  return (
    <>
      <div className="">
        {/* LOGO */}

        <header className="p-4 flex flex-col">
          <div id="logo_menue" className="flex justify-between mb-5">
            <a href="/" className="flex items-center gap-1">
              <img src="/logo.png" alt="Logo" className="w-30 h-20 mr-0" />
            </a>
            <Link to={user ? "/account" : "/login"} className="pt-10">
              <div className="flex gap-2 border border-gray-300 rounded-full py-2 px-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 6.75A.75.75 0 013.75 6h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 6.75zM3 12a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 12zm0 5.25a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75z"
                    clipRule="evenodd"
                  />
                </svg>

                <div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                {!!user && <div>{user.name}</div>}
              </div>
            </Link>
          </div>
          <div id="searchbar">
            {location.pathname === '/' && (
              <Search
                setSearchResults={setSearchResults}
                setSearchButtonClick={setSearchButtonClick}
              />
            )}

          </div>
        </header>
      </div>
    </>
  );
};

export default Header;