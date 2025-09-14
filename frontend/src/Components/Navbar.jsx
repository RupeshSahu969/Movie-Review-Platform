import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../AuthContext/AuthContext";
import { FaBars, FaTimes } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";

const Navbar = () => {
  const { email, logout, isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  
  return (
    <nav className="bg-gray-900 text-white w-full fixed top-0 z-50 shadow">
      <div className="container mx-auto flex justify-between items-center px-4 py-3">
        <Link to="/" className="text-2xl font-bold">
          MovieReview
        </Link>

        <div className="hidden md:flex space-x-6 items-center">
          <Link to="/movies" className="hover:text-yellow-400">
            Movies
          </Link>

          {isAuthenticated && (
            <Link to="/watchlist" className="hover:text-yellow-400">
              Watchlist
            </Link>
          )}

          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-2 focus:outline-none"
              >
                <CgProfile className="w-8 h-8 text-yellow-400" />
                <span>{email}</span>
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded shadow-md">
                  <Link
                    to="/profile"
                    state={{ edit: true }}
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Edit Profile
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="hover:text-yellow-400">
                Login
              </Link>
              <Link to="/register" className="hover:text-yellow-400">
                Register
              </Link>
            </>
          )}
        </div>

        <button className="md:hidden text-xl" onClick={toggleMenu}>
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden bg-gray-800 px-6 py-4 flex flex-col space-y-4">
          <Link
            to="/movies"
            className="hover:text-yellow-400"
            onClick={toggleMenu}
          >
            Movies
          </Link>

          {isAuthenticated && (
            <Link
              to="/watchlist"
              className="hover:text-yellow-400"
              onClick={toggleMenu}
            >
              Watchlist
            </Link>
          )}

          {isAuthenticated ? (
            <>
              <Link
                to="/profile"
                state={{ edit: true }}
                className="hover:text-yellow-400"
                onClick={toggleMenu}
              >
                Edit Profile
              </Link>
              <button
                onClick={() => {
                  logout();
                  toggleMenu();
                }}
                className="text-left text-red-500 hover:bg-gray-700 px-4 py-2 rounded"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="hover:text-yellow-400"
                onClick={toggleMenu}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="hover:text-yellow-400"
                onClick={toggleMenu}
              >
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
