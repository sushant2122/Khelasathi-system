
import { useContext } from "react";
import logo from "../../assets/images/logo copy.png"
import { NavLink, useNavigate } from "react-router-dom";
import { faSignIn } from "@fortawesome/free-solid-svg-icons/faSignIn";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faUser } from "@fortawesome/free-solid-svg-icons";
import AuthContext from "../../context/auth.context";

function HeaderComponent() {
    const Navigate = useNavigate();
    const auth: any = useContext(AuthContext);
    console.log(auth);
    // localStorage.removeItem('access');
    // localStorage.removeItem('refresh');
    const logout = () => {
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        Navigate('/signin')
    };
    const accounttoggleDropdown = () => {
        document.getElementById("userDropdown1")?.classList.toggle("hidden");
    };
    const menutoggleDropdown = () => {
        document.getElementById("ecommerce-navbar-menu-1")?.classList.toggle("hidden");
    };
    return (
        <>
            <nav className="bg-gray-100 dark:bg-gray-800 antialiased">
                <div className="max-w-screen-xl px-4 mx-auto 2xl:px-0 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-8">
                            <div className="shrink-0 flex items-center space-x-2">
                                <NavLink to="/" className="flex items-center space-x-2">
                                    <img className="block w-auto h-8 dark:hidden" src={logo} alt="Logo" />
                                    <h2 className="text-lg font-semibold">
                                        Khela<span className="text-amber-700">Sathi</span>
                                    </h2>
                                </NavLink>
                            </div>
                            <ul className="hidden lg:flex items-center justify-start gap-6 md:gap-8 py-3 sm:justify-center">
                                <li>
                                    <NavLink to="/" className="flex text-m font-medium text-gray-900 hover:text-amber-700 dark:text-white dark:hover:text-primary-500">
                                        Home
                                    </NavLink>
                                </li>
                                <li className="shrink-0">
                                    <NavLink to="/futsal" className="flex text-m font-medium text-gray-900 hover:text-amber-700 dark:text-white dark:hover:text-primary-500">
                                        Futsal
                                    </NavLink>
                                </li>
                                <li className="shrink-0">
                                    <NavLink to="/about-us" className="flex text-m font-medium text-gray-900 hover:text-amber-700  dark:text-white dark:hover:text-primary-500">
                                        About us
                                    </NavLink>
                                </li>
                                <li className="shrink-0">
                                    <NavLink to="/contact-us" className="text-m font-medium text-gray-900 hover:text-amber-700 dark:text-white dark:hover:text-primary-500">
                                        Contact us
                                    </NavLink>
                                </li>

                            </ul>
                        </div>


                        <div className="flex items-center lg:space-x-2 ">
                            {auth.loggedInUser ? <>
                                <div className="relative">
                                    <button id="userDropdownButton1" onClick={accounttoggleDropdown} type="button" className="inline-flex items-center rounded-lg  justify-center p-2 hover:bg-amber-700  dark:hover:bg-gray-700 text-sm font-medium leading-none text-gray-900 dark:text-white hover:text-white">
                                        <FontAwesomeIcon icon={faUser} />
                                        &ensp;
                                        {auth && auth.loggedInUser ? auth.loggedInUser.full_name : "Account"}
                                        &ensp;
                                        <FontAwesomeIcon icon={faAngleDown} />
                                    </button>
                                    <div id="userDropdown1" className="absolute w-52 hidden z-10 mt-2 right-0 divide-y  divide-gray-100 overflow-hidden overflow-y-auto rounded-lg bg-white antialiased shadow dark:divide-gray-600 dark:bg-gray-700">
                                        <ul className="p-2 text-start text-sm font-medium text-gray-900 dark:text-white">
                                            <li><NavLink to="/user-profile" className="inline-flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-amber-700 hover:text-white "> My Account </NavLink></li>
                                            <li><NavLink to="/my-point" className="inline-flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-amber-700  hover:text-white"> My points </NavLink></li>
                                            <li><NavLink to="/my-booking" className="inline-flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-amber-700 hover:text-white "> My Bookings </NavLink></li>
                                            <li><NavLink to="/my-transaction" className="inline-flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-amber-700 hover:text-white "> My transaction </NavLink></li>
                                            <li><NavLink to="/setting" className="inline-flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-amber-700 hover:text-white "> Settings </NavLink></li>

                                        </ul>
                                        <div className="p-2 text-sm font-medium text-gray-900 dark:text-white">
                                            <button onClick={logout} className="inline-flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-amber-700 hover:text-white"> Sign Out </button>
                                        </div>
                                    </div>
                                </div>
                            </> : <>
                                <NavLink to="signin" className="inline-flex items-center rounded-lg bg-gray-200  justify-center p-2 hover:bg-amber-700  dark:hover:bg-gray-700 text-sm font-medium leading-none text-gray-900 dark:text-white hover:text-white">
                                    Sign in &ensp;
                                    <FontAwesomeIcon icon={faSignIn} />
                                </NavLink>
                            </>}



                            <button type="button" onClick={menutoggleDropdown} aria-controls="ecommerce-navbar-menu-1" aria-expanded="false" className=" hover:bg-amber-700 inline-flex lg:hidden items-center justify-center  rounded-md dark:hover:bg-gray-700 p-2 text-gray-900 dark:text-white">
                                <span className="sr-only">
                                    Open Menu
                                </span>
                                <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none" viewBox="0 0 24 24">
                                    <path stroke="currentColor" strokeLinecap="round" strokeWidth={2} d="M5 7h14M5 12h14M5 17h14" />
                                </svg>
                            </button>
                        </div>
                    </div>
                    <div id="ecommerce-navbar-menu-1" className="bg-gray-50 lg:hidden  dark:bg-gray-700 dark:border-gray-600 border border-gray-200 rounded-lg py-3 hidden px-4 mt-4">
                        <ul className="text-gray-900  text-sm font-medium dark:text-white space-y-3">
                            <li>
                                <NavLink to="/" className="hover:text-primary-700 hover:text-amber-700">Home</NavLink>
                            </li>
                            <li>
                                <NavLink to="/futsal" className="hover:text-primary-700 hover:text-amber-700">Futsal</NavLink>
                            </li>
                            <li>
                                <NavLink to="/about-us" className="hover:text-primary-700 hover:text-amber-700">About us</NavLink>
                            </li>
                            <li>
                                <NavLink to="/contact-us" className="hover:text-primary-700 hover:text-amber-700">Contact us</NavLink>
                            </li>

                        </ul>
                    </div>
                </div>
            </nav>

        </>
    );
}

export default HeaderComponent;
