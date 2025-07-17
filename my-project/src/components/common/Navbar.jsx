import React, { useEffect, useState } from "react";
import Logo from "../../assets/Logo/Logo-Full-Light.png";
import { Link, matchPath } from "react-router-dom";
import { NavbarLinks } from "../../data/navbar-links";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { ACCOUNT_TYPE } from "../../utils/constants";
import { AiOutlineShoppingCart } from "react-icons/ai";
import ProfileDropDown from "../core/Auth/ProfileDropDown";
import { apiConnector } from "../../Services/apiConnector";
import { categories } from "../../Services/api";
import { FaChevronDown } from "react-icons/fa";

const subLinks = [
  {
    title: "python",
    link: "/catalog/python",
  },
  {
    title: "web dev",
    link: "/catalog/web-development",
  },
];
export default function Navbar() {
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const { totalItems } = useSelector((state) => state.cart);
  const location = useLocation();
  const [subLinks, setSubLinks] = useState([]);
  const fetchSubLinks = async () => {
    try {
      const result = await apiConnector("GET", categories.CATEGORIES_API);
      console.log(result);
      //setSubLinks(result.data.data);
    } catch (error) {
      console.log("counld not fetch catalog list");
    }
  };

  useEffect(() => {
    //fetchSubLinks();
  }, []);

  const matchRoute = (route) => {
    return matchPath({ path: route }, location.pathname);
  };

  return (
    <div className="flex h-14 items-center justify-center border-b-[1px] border-b-richblack-700">
      <div className="flex w-11/12 max-w-maxContent items-center justify-between ">
        {/* {image} */}
        <Link to="/">
          <img src={Logo} width={160} height={42} loading="lazy" />
        </Link>
        {/* {nav-links} */}
        <nav>
          <ul className="flex gap-x-6 text-richblack-25 ">
            {NavbarLinks.map((link, index) => (
              <li key={index}>
                {link.title === "Catalog" ? (
                  <div className="relative flex items-center gap-2 group">
                    <p>{link.title}</p>
                    <FaChevronDown />

                    <div className="invisible absolute left-[50%] translate-x-[-50%] translate-y-[80%] top-[50%] flex flex-col rounded-md bg-richblack-5 p-4 text-richblue-900 opacity-0 transition duration-200 group-hover:visible group-hover:opacity-100 lg:w-[300px]">
                      <div className="absolute left-[50%] top-0 translate-y-[-45%] h-6 w-6 rotate-45 rounded bg-richblack-5 translate-x-[80%]"></div>
                      {subLinks.length > 0 ? (
                        subLinks.map((subLink, index) => (
                          <Link to={`${subLink.link}`}>
                            <p>{subLink.title}</p>
                          </Link>
                        ))
                      ) : (
                        <div></div>
                      )}
                    </div>
                  </div>
                ) : (
                  <Link to={link?.path}>
                    {" "}
                    <p
                      className={`${
                        matchRoute(link?.path)
                          ? "text-yellow-25"
                          : "text-richblack-25"
                      }`}
                    >
                      {link.title}
                    </p>{" "}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
        {/* Login/signup/dashboard */}
        {/* {if not log in then login sign up} */}
        {/* {if logged in then cart profile} */}
        {/* {if instructor no cart} */}
        <div className="flex gap-x-4 items-center">
          {user && user.accountType !== ACCOUNT_TYPE.INSTRUCTOR && (
            <Link to="/dashboard/cart" className="relative">
              <AiOutlineShoppingCart />
              {totalItems > 0 && <span>{totalItems}</span>}
            </Link>
          )}
          {token === null && (
            <Link to="/login">
              <button className="border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100 rounded-md">
                Log in
              </button>
            </Link>
          )}
          {token === null && (
            <Link
              className="border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100 rounded-md"
              to="/signup"
            >
              <button>Sign Up</button>
            </Link>
          )}
          {token !== null && <ProfileDropDown />}
        </div>
      </div>
    </div>
  );
}
