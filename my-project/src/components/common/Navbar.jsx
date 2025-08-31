import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { AiOutlineMenu, AiOutlineShoppingCart } from "react-icons/ai";
import { BsChevronDown } from "react-icons/bs";
import logo from "../../assets/Logo/Logo-Full-Light.png";
import { NavbarLinks } from "../../data/navbar-links";
import { apiConnector } from "../../Services/apiConnector";
import { categories } from "../../Services/api";
import { ACCOUNT_TYPE } from "../../utils/constants";
import ProfileDropdown from "../core/Auth/ProfileDropDown";

function Navbar() {
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const { totalItems } = useSelector((state) => state.cart);
  const location = useLocation();
  const [subLinks, setSubLinks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const res = await apiConnector("GET", categories.CATEGORIES_API);
        setSubLinks(res.data.data);
      } catch (error) {
        console.log("Could not fetch Categories.", error);
      }
      setLoading(false);
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    setDropdownOpen(false);
    setMobileMenuOpen(false);
  }, [location]);

  const matchRoute = (route) => location.pathname === route;

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <div className="navbarContainer sticky top-0 left-0 z-1000">
      <div className="flex items-center justify-center bg-black border-b-[1px] border-b-richblack-800">
        <div className="flex flex-col md:flex-row w-full max-w-maxContent items-center justify-between px-4 py-2">
          {/* Logo + Mobile Menu */}
          <div className="flex items-center justify-between w-full md:w-auto px-1 py-1">
            <Link to="/" onClick={closeMobileMenu}>
              <img
                src={logo}
                alt="Logo"
                width={170}
                height={32}
                loading="lazy"
              />
            </Link>
            <button
              className="block md:hidden text-2xl text-richblack-25 focus:outline-none"
              onClick={toggleMobileMenu}
            >
              {mobileMenuOpen ? "✖" : <AiOutlineMenu />}
            </button>
          </div>

          {/* Nav Links */}
          <nav
            className={`${mobileMenuOpen ? "block" : "hidden"} md:block mt-4 md:mt-0`}
          >
            <ul className="flex flex-col md:flex-row w-full max-w-maxContent items-center justify-between px-4 py-2 gap-y-4 md:gap-y-0 md:gap-x-14">
              {NavbarLinks.map(({ title, path }, index) => (
                <li
                  key={index}
                  className="mb-2 md:mb-0 transition duration-300 ease-in-out transform hover:text-yellow-25 hover:scale-105 relative"
                >
                  {title === "Catalog" ? (
                    <div
                      className={`group relative flex cursor-pointer items-center gap-1 ${
                        matchRoute("/catalog/:catalogName")
                          ? "text-yellow-100 hover:text-yellow-200"
                          : "text-richblack-25 hover:text-richblack-50"
                      }`}
                      onClick={toggleDropdown}
                    >
                      <p>{title}</p>
                      <BsChevronDown />

                      {dropdownOpen && (
                        <div
                          className="absolute left-1/2 top-1/2 z-[9999] w-[200px] -translate-x-1/2 translate-y-[3em] 
                                     flex flex-col rounded-lg bg-richblack-5 shadow-lg p-2 text-richblack-900 
                                     transition-all duration-150 lg:w-[300px]"
                        >
                          {/* Arrow */}
                          <div
                            className="absolute left-1/2 top-0 h-4 w-4 -translate-x-1/2 -translate-y-1/2 
                                       rotate-45 bg-richblack-5 shadow-md"
                          ></div>

                          {loading ? (
                            <p className="text-center">Loading...</p>
                          ) : subLinks && subLinks.length ? (
                            <>
                              {subLinks
                                .filter((subLink) => subLink?.courses?.length > 0)
                                .map((subLink, i) => (
                                  <Link
                                    to={`/catalog/${subLink.name
                                      .split(" ")
                                      .join("-")
                                      .toLowerCase()}`}
                                    className="rounded-md px-4 py-2 text-sm hover:bg-richblack-200"
                                    key={i}
                                    onClick={toggleDropdown}
                                  >
                                    {subLink.name}
                                  </Link>
                                ))}
                            </>
                          ) : (
                            <p className="text-center">No Courses Found</p>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link to={path} onClick={closeMobileMenu}>
                      <p
                        className={`${
                          matchRoute(path)
                            ? "text-yellow-25"
                            : "text-richblack-25"
                        } hover:text-yellow-25`}
                      >
                        {title}
                      </p>
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {/* Right Side: Cart / Auth */}
          <div className={`${mobileMenuOpen ? "block" : "hidden"} md:block mt-2 md:mt-0`}>
            <div className="flex flex-col items-center md:flex-row md:items-center justify-center md:justify-start gap-y-4 md:gap-y-0 gap-x-8">
              {user && user.accountType !== ACCOUNT_TYPE.INSTRUCTOR && (
                <Link to="/dashboard/cart" className="relative" onClick={closeMobileMenu}>
                  <AiOutlineShoppingCart className="text-2xl text-richblack-100" />
                  {totalItems > 0 && (
                    <span className="absolute -bottom-2 -right-2 grid h-5 w-5 place-items-center rounded-full bg-richblack-600 text-xs font-bold text-yellow-500">
                      {totalItems}
                    </span>
                  )}
                </Link>
              )}

              {!token && (
                <div className="flex flex-col md:flex-row items-center gap-y-4 md:gap-y-0 md:gap-x-4">
                  <Link to="/login" onClick={closeMobileMenu}>
                    <button
                      className={`rounded-md px-4 w-[90px] py-2 transition duration-300 hover:scale-95 ${
                        matchRoute("/login")
                          ? "bg-richblack-800 text-white"
                          : "bg-yellow-50 text-black hover:bg-richblack-800 hover:text-white"
                      }`}
                    >
                      Log In
                    </button>
                  </Link>
                  <Link to="/signup" onClick={closeMobileMenu}>
                    <button
                      className={`rounded-md px-4 w-[90px] py-2 transition duration-300 hover:scale-95 ${
                        matchRoute("/signup")
                          ? "bg-richblack-800 text-white"
                          : "bg-blue-50 text-white hover:bg-richblack-800 hover:text-gray-200"
                      }`}
                    >
                      Sign Up
                    </button>
                  </Link>
                </div>
              )}

              {token && <ProfileDropdown />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
